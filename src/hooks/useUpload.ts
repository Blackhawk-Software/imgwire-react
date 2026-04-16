import type { ImagesUploadOptions, ImgwireImage } from "@imgwire/js";
import { useState } from "react";
import { useClient } from "./useClient.ts";

export type UploadProgress = {
  loaded: number;
  total: number | null;
  percent: number | null;
  lengthComputable: boolean;
};

const INITIAL_PROGRESS: UploadProgress = {
  loaded: 0,
  total: null,
  percent: null,
  lengthComputable: false
};

export function useUpload(): [
  (file: File, options?: ImagesUploadOptions) => Promise<ImgwireImage>,
  UploadProgress
] {
  const client = useClient();
  const [progress, setProgress] = useState<UploadProgress>(INITIAL_PROGRESS);

  async function upload(file: File, options?: ImagesUploadOptions) {
    setProgress(INITIAL_PROGRESS);

    return client.images.upload(file, {
      ...options,
      onProgress(nextProgress) {
        setProgress({
          loaded: nextProgress.loaded,
          total: nextProgress.total,
          percent: nextProgress.percent,
          lengthComputable: nextProgress.lengthComputable
        });
        options?.onProgress?.(nextProgress);
      }
    });
  }

  return [upload, progress];
}
