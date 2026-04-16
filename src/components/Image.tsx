import type { CSSProperties } from "react";
import type { ImageUrlOptions } from "@imgwire/js";
import { useClient } from "../hooks/useClient.ts";
import type {
  BooleanLike,
  CropValue,
  ExtendValue,
  FlipValue,
  GravityValue,
  ImageLoader,
  ImageUrlPreset,
  OutputFormat,
  PaddingValue,
  ResizingType,
  RotateAngle
} from "../types.ts";
import { buildImageUrl } from "../utils/buildImageUrl.ts";
import { useResolvedImageSource } from "../utils/resolve-image-source.ts";

export type ImageProps = {
  id?: string;
  url?: string;
  preset?: ImageUrlPreset;
  background?: string;
  bg?: string;
  blur?: number;
  bl?: number;
  crop?: CropValue;
  c?: CropValue;
  dpr?: number;
  enlarge?: BooleanLike;
  el?: BooleanLike;
  extend?: ExtendValue;
  ex?: ExtendValue;
  extend_aspect_ratio?: ExtendValue;
  extend_ar?: ExtendValue;
  exar?: ExtendValue;
  flip?: FlipValue;
  fl?: FlipValue;
  format?: OutputFormat;
  f?: OutputFormat;
  extension?: OutputFormat;
  ext?: OutputFormat;
  gravity?: GravityValue;
  g?: GravityValue;
  height?: number;
  h?: number;
  keep_copyright?: BooleanLike;
  kcr?: BooleanLike;
  "min-height"?: number;
  mh?: number;
  "min-width"?: number;
  mw?: number;
  padding?: PaddingValue;
  pd?: PaddingValue;
  pixelate?: number;
  pix?: number;
  quality?: number;
  q?: number;
  resizing_type?: ResizingType;
  rotate?: RotateAngle;
  rot?: RotateAngle;
  sharpen?: number;
  sh?: number;
  strip_color_profile?: BooleanLike;
  scp?: BooleanLike;
  strip_metadata?: BooleanLike;
  sm?: BooleanLike;
  width?: number;
  w?: number;
  zoom?: number;
  z?: number;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  loading?: "lazy" | "eager";
  loader?: ImageLoader;
};

export function Image(props: ImageProps) {
  const client = useClient();

  if (!props.id && !props.url) {
    throw new Error("<Image /> requires either an id or a url.");
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

  const src = buildImageUrl(baseUrl, getImageTransformOptions(props));

  return (
    <img
      alt={props.alt ?? ""}
      className={props.className}
      loading={props.loading}
      src={src}
      style={props.style}
    />
  );
}

export function getImageTransformOptions(props: ImageProps): ImageUrlOptions {
  return compactTransformOptions({
    preset: props.preset,
    background: props.background,
    bg: props.bg,
    blur: props.blur,
    bl: props.bl,
    crop: props.crop,
    c: props.c,
    dpr: props.dpr,
    enlarge: props.enlarge,
    el: props.el,
    extend: props.extend,
    ex: props.ex,
    extend_aspect_ratio: props.extend_aspect_ratio,
    extend_ar: props.extend_ar,
    exar: props.exar,
    flip: props.flip,
    fl: props.fl,
    format: props.format,
    f: props.f,
    extension: props.extension,
    ext: props.ext,
    gravity: props.gravity,
    g: props.g,
    height: props.height,
    h: props.h,
    keep_copyright: props.keep_copyright,
    kcr: props.kcr,
    "min-height": props["min-height"],
    mh: props.mh,
    "min-width": props["min-width"],
    mw: props.mw,
    padding: props.padding,
    pd: props.pd,
    pixelate: props.pixelate,
    pix: props.pix,
    quality: props.quality,
    q: props.q,
    resizing_type: props.resizing_type,
    rotate: props.rotate,
    rot: props.rot,
    sharpen: props.sharpen,
    sh: props.sh,
    strip_color_profile: props.strip_color_profile,
    scp: props.scp,
    strip_metadata: props.strip_metadata,
    sm: props.sm,
    width: props.width,
    w: props.w,
    zoom: props.zoom,
    z: props.z
  });
}

function compactTransformOptions(options: ImageUrlOptions): ImageUrlOptions {
  return Object.fromEntries(
    Object.entries(options).filter(([, value]) => value !== undefined)
  ) as ImageUrlOptions;
}
