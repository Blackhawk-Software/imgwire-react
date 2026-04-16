import type {
  ImageSchema,
  ImagesCreateOptions,
  ImageUrlOptions,
  ImageUrlPreset,
  ImgwireClient,
  ImgwireClientOptions,
  ImgwireImage,
  ImagesUploadOptions,
  BooleanLike,
  CropValue,
  ExtendValue,
  FlipValue,
  GravityValue,
  OutputFormat,
  PaddingValue,
  ResizingType,
  RotateAngle
} from "@imgwire/js";

export type ClientOptions = ImgwireClientOptions;
export type ImgwireImageData = ImgwireImage;
export type ImageMetadata = ImageSchema;
export type ImageTransforms = ImageUrlOptions;
export type CreateImageOptions = ImagesCreateOptions;
export type UploadOptions = ImagesUploadOptions;
export type ImgwireReactClient = ImgwireClient;
export type {
  BooleanLike,
  CropValue,
  ExtendValue,
  FlipValue,
  GravityValue,
  ImageUrlPreset,
  OutputFormat,
  PaddingValue,
  ResizingType,
  RotateAngle
};

export type ImageLoaderResult = {
  url: string;
};

export type ImageLoader = (id: string) => Promise<ImageLoaderResult>;
