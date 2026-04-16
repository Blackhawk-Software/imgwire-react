import type { ImageUrlOptions } from "@imgwire/js";
import { useClient } from "../hooks/useClient.ts";
import type { CropValue, GravityValue, OutputFormat } from "../types.ts";
import { buildImageUrl } from "../utils/buildImageUrl.ts";
import { useResolvedImageSource } from "../utils/resolve-image-source.ts";
import { type ImageProps, getImageTransformOptions } from "./Image.tsx";

export type ResponsiveBreakpoint = {
  minWidth: number;
  width?: number;
  height?: number;
  dpr?: number[];
  crop?: CropValue;
  gravity?: GravityValue;
  quality?: number;
  format?: OutputFormat;
};

export type ResponsiveImageProps = Omit<
  ImageProps,
  "width" | "height" | "dpr"
> & {
  breakpoints?: Record<string, ResponsiveBreakpoint>;
  dpr?: number[];
};

export const DEFAULT_BREAKPOINTS: Record<string, ResponsiveBreakpoint> = {
  sm: { minWidth: 0, width: 320 },
  md: { minWidth: 640, width: 640 },
  lg: { minWidth: 1024, width: 1024 },
  xl: { minWidth: 1440, width: 1440 }
};

const DEFAULT_DPRS = [1, 2];

export function ResponsiveImage(props: ResponsiveImageProps) {
  const client = useClient();
  const { dpr: globalDpr, ...imageProps } = props;

  if (!props.id && !props.url) {
    throw new Error("<ResponsiveImage /> requires either an id or a url.");
  }

  const { baseUrl, isLoading, error } = useResolvedImageSource({
    id: props.id,
    url: props.url,
    loader: props.loader,
    client
  });

  if (error) {
    throw error;
  }

  if (isLoading || !baseUrl) {
    return null;
  }

  const breakpoints = Object.values(props.breakpoints ?? DEFAULT_BREAKPOINTS)
    .slice()
    .sort((left, right) => left.minWidth - right.minWidth);
  const smallestBreakpoint = breakpoints[0];

  const src = buildImageUrl(
    baseUrl,
    mergeTransforms(getImageTransformOptions(imageProps), smallestBreakpoint, 1)
  );

  const srcSet = breakpoints
    .flatMap((breakpoint) => {
      const dprs = breakpoint.dpr ?? props.dpr ?? DEFAULT_DPRS;

      return dprs.map((dpr) => {
        const width = breakpoint.width ? breakpoint.width * dpr : undefined;
        const url = buildImageUrl(
          baseUrl,
          mergeTransforms(getImageTransformOptions(imageProps), breakpoint, dpr)
        );

        return width ? `${url} ${width}w` : `${url} ${dpr}x`;
      });
    })
    .join(", ");

  const sizes = breakpoints
    .slice()
    .sort((left, right) => right.minWidth - left.minWidth)
    .map((breakpoint, index, items) => {
      const sizeWidth = breakpoint.width ?? items[items.length - 1]?.width;
      if (!sizeWidth) {
        return null;
      }

      if (index === items.length - 1) {
        return `${sizeWidth}px`;
      }

      return `(min-width: ${breakpoint.minWidth}px) ${sizeWidth}px`;
    })
    .filter((value): value is string => value !== null)
    .join(", ");

  return (
    <img
      alt={props.alt ?? ""}
      className={props.className}
      loading={props.loading}
      sizes={sizes}
      src={src}
      srcSet={srcSet}
      style={props.style}
    />
  );
}

function mergeTransforms(
  base: ImageUrlOptions,
  breakpoint: ResponsiveBreakpoint,
  dpr: number
): ImageUrlOptions {
  return {
    ...base,
    width: breakpoint.width ?? base.width,
    height: breakpoint.height ?? base.height,
    crop: breakpoint.crop ?? base.crop,
    gravity: breakpoint.gravity ?? base.gravity,
    quality: breakpoint.quality ?? base.quality,
    format: breakpoint.format ?? base.format,
    dpr
  };
}
