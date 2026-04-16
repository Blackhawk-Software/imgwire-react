import { afterEach, describe, expect, it, vi } from "vitest";
import { createImage } from "../src/createImage.ts";

const createImageResource = vi.fn();
const imgwireConstructor = vi.fn();

vi.mock("@imgwire/js", () => {
  class ImgwireClient {
    options: Record<string, unknown>;
    images = {
      create: createImageResource
    };

    constructor(options: Record<string, unknown>) {
      this.options = options;
      imgwireConstructor(options);
    }
  }

  return {
    ImgwireClient
  };
});

describe("createImage", () => {
  afterEach(() => {
    createImageResource.mockReset();
    imgwireConstructor.mockReset();
  });

  it("uses a provided client instance", async () => {
    const client = {
      images: {
        create: vi.fn().mockResolvedValue({
          upload_url: "https://upload.example.com",
          image: { id: "img_123" }
        })
      }
    } as any;

    const result = await createImage({
      body: { file_name: "example.png" },
      client
    });

    expect(client.images.create).toHaveBeenCalledWith(
      { file_name: "example.png" },
      undefined
    );
    expect(result).toEqual({
      uploadUrl: "https://upload.example.com",
      image: { id: "img_123" }
    });
  });

  it("creates a client from config when one is not provided", async () => {
    createImageResource.mockResolvedValue({
      upload_url: "https://upload.example.com",
      image: { id: "img_123" }
    });

    const result = await createImage({
      body: { file_name: "example.png" },
      config: { apiKey: "ck_create", fetch },
      options: { uploadToken: "token_123" }
    });

    expect(imgwireConstructor).toHaveBeenCalledWith({
      apiKey: "ck_create",
      fetch
    });
    expect(createImageResource).toHaveBeenCalledWith(
      { file_name: "example.png" },
      { uploadToken: "token_123" }
    );
    expect(result.uploadUrl).toBe("https://upload.example.com");
  });

  it("throws without a client or config", async () => {
    await expect(
      createImage({
        body: { file_name: "example.png" }
      })
    ).rejects.toThrow(
      "createImage requires either a client instance or a config object."
    );
  });
});
