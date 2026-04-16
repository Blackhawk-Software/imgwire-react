import type { ImgwireImage } from "@imgwire/js";
import { useEffect, useState } from "react";
import { useClient } from "./useClient.ts";

export function useFetchImage(id: string): {
  data: ImgwireImage | null;
  isLoading: boolean;
  error: Error | null;
} {
  const client = useClient();
  const [data, setData] = useState<ImgwireImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    client.images
      .fetch(id)
      .then((image) => {
        if (cancelled) {
          return;
        }
        setData(image);
        setIsLoading(false);
      })
      .catch((cause) => {
        if (cancelled) {
          return;
        }
        setData(null);
        setError(
          cause instanceof Error ? cause : new Error("Failed to fetch image.")
        );
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [client, id]);

  return { data, isLoading, error };
}
