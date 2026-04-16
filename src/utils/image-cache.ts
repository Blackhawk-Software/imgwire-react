import type { ImageLoaderResult } from "../types.ts";

const CACHE_TTL_MS = 5 * 60 * 1000;
const resolvedImageCache = new Map<string, { url: string; ts: number }>();
const inFlightImageRequests = new Map<string, Promise<ImageLoaderResult>>();

export function getCachedImageUrl(id: string): string | null {
  const cached = resolvedImageCache.get(id);
  if (!cached) {
    return null;
  }

  if (Date.now() - cached.ts > CACHE_TTL_MS) {
    resolvedImageCache.delete(id);
    return null;
  }

  return cached.url;
}

export function resolveCachedImageUrl(
  id: string,
  loader: (id: string) => Promise<ImageLoaderResult>
): Promise<ImageLoaderResult> {
  const cachedUrl = getCachedImageUrl(id);
  if (cachedUrl) {
    return Promise.resolve({ url: cachedUrl });
  }

  const pendingRequest = inFlightImageRequests.get(id);
  if (pendingRequest) {
    return pendingRequest;
  }

  const request = loader(id)
    .then((result) => {
      resolvedImageCache.set(id, {
        url: result.url,
        ts: Date.now()
      });
      return result;
    })
    .finally(() => {
      inFlightImageRequests.delete(id);
    });

  inFlightImageRequests.set(id, request);
  return request;
}

export function clearImageUrlCache() {
  resolvedImageCache.clear();
  inFlightImageRequests.clear();
}
