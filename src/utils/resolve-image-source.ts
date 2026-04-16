import type { ImgwireClient, ImageUrlOptions } from "@imgwire/js";
import { useEffect, useState } from "react";
import type { ImageLoader } from "../types.ts";
import { resolveCachedImageUrl } from "./image-cache.ts";

export type ResolvedImageSource = {
  baseUrl: string | null;
  isLoading: boolean;
  error: Error | null;
};

function defaultLoader(client: ImgwireClient): ImageLoader {
  return async (id: string) => {
    const image = await client.images.fetch(id);
    return { url: image.cdn_url };
  };
}

export function useResolvedImageSource({
  id,
  url,
  loader,
  client
}: {
  id?: string;
  url?: string;
  loader?: ImageLoader;
  client: ImgwireClient;
  transforms?: ImageUrlOptions;
}): ResolvedImageSource {
  const [state, setState] = useState<ResolvedImageSource>({
    baseUrl: url ?? null,
    isLoading: Boolean(id && !url),
    error: null
  });

  useEffect(() => {
    let cancelled = false;

    if (url) {
      setState({
        baseUrl: url,
        isLoading: false,
        error: null
      });
      return;
    }

    if (!id) {
      setState({
        baseUrl: null,
        isLoading: false,
        error: new Error("Image requires either an id or a url.")
      });
      return;
    }

    setState({
      baseUrl: null,
      isLoading: true,
      error: null
    });

    resolveCachedImageUrl(id, loader ?? defaultLoader(client))
      .then((result) => {
        if (cancelled) {
          return;
        }

        setState({
          baseUrl: result.url,
          isLoading: false,
          error: null
        });
      })
      .catch((cause) => {
        if (cancelled) {
          return;
        }

        setState({
          baseUrl: null,
          isLoading: false,
          error:
            cause instanceof Error
              ? cause
              : new Error("Failed to resolve image URL.")
        });
      });

    return () => {
      cancelled = true;
    };
  }, [client, id, loader, url]);

  return state;
}
