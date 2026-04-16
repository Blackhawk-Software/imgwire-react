import type { ReactNode } from "react";
import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ImgwireProvider } from "../src/provider/ImgwireProvider.tsx";
import { useUpload } from "../src/hooks/useUpload.ts";

const uploadImage = vi.fn();

vi.mock("@imgwire/js", () => {
  class ImgwireClient {
    options: Record<string, unknown>;
    images = {
      upload: uploadImage
    };

    constructor(options: Record<string, unknown>) {
      this.options = options;
    }
  }

  return {
    ImgwireClient
  };
});

describe("useUpload", () => {
  afterEach(() => {
    uploadImage.mockReset();
  });

  it("uploads through the client and updates progress state", async () => {
    const onProgress = vi.fn();
    uploadImage.mockImplementation(
      async (
        _file: File,
        options?: { onProgress?: (progress: any) => void }
      ) => {
        options?.onProgress?.({
          loaded: 50,
          total: 100,
          percent: 50,
          lengthComputable: true
        });

        return { id: "img_uploaded" };
      }
    );

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ImgwireProvider config={{ apiKey: "ck_upload", fetch }}>
        {children}
      </ImgwireProvider>
    );

    const { result } = renderHook(() => useUpload(), { wrapper });
    const file = new File(["hello"], "example.txt", { type: "text/plain" });

    await act(async () => {
      const image = await result.current[0](file, { onProgress });
      expect(image).toEqual({ id: "img_uploaded" });
    });

    expect(uploadImage).toHaveBeenCalledTimes(1);
    expect(onProgress).toHaveBeenCalledWith({
      loaded: 50,
      total: 100,
      percent: 50,
      lengthComputable: true
    });
    expect(result.current[1]).toEqual({
      loaded: 50,
      total: 100,
      percent: 50,
      lengthComputable: true
    });
  });

  it("resets progress before each upload attempt", async () => {
    let callCount = 0;
    let resolveSecondUpload: ((value: { id: string }) => void) | undefined;
    uploadImage.mockImplementation(
      async (
        _file: File,
        options?: { onProgress?: (progress: any) => void }
      ) => {
        callCount += 1;

        if (callCount === 1) {
          options?.onProgress?.({
            loaded: 100,
            total: 100,
            percent: 100,
            lengthComputable: true
          });

          return { id: `img_${callCount}` };
        }

        if (callCount === 2) {
          return new Promise<{ id: string }>((resolve) => {
            resolveSecondUpload = resolve;
          });
        }

        return { id: `img_${callCount}` };
      }
    );

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ImgwireProvider config={{ apiKey: "ck_upload", fetch }}>
        {children}
      </ImgwireProvider>
    );

    const { result } = renderHook(() => useUpload(), { wrapper });
    const file = new File(["hello"], "example.txt", { type: "text/plain" });

    await act(async () => {
      await result.current[0](file);
    });

    expect(result.current[1].percent).toBe(100);

    await act(async () => {
      void result.current[0](file);
      await Promise.resolve();
    });

    expect(result.current[1]).toEqual({
      loaded: 0,
      total: null,
      percent: null,
      lengthComputable: false
    });

    await act(async () => {
      resolveSecondUpload?.({ id: "img_2" });
    });
  });
});
