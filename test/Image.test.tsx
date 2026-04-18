import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ImgwireProvider } from "../src/provider/ImgwireProvider.tsx";
import { Image } from "../src/components/Image.tsx";
import { clearImageUrlCache } from "../src/utils/image-cache.ts";

const fetchImage = vi.fn();

vi.mock("@imgwire/js", () => {
  class ImgwireClient {
    options: { apiKey: string; fetch?: typeof fetch };
    images = {
      fetch: fetchImage
    };

    constructor(options: { apiKey: string; fetch?: typeof fetch }) {
      this.options = options;
    }
  }

  class ImageUrlBuilder {
    private image: { cdn_url: string };

    constructor(image: { cdn_url: string }) {
      this.image = image;
    }

    build(options?: { width?: number }) {
      if (!options?.width) {
        return this.image.cdn_url;
      }

      return `${this.image.cdn_url}?width=${options.width}`;
    }
  }

  return {
    ImgwireClient,
    ImageUrlBuilder
  };
});

describe("<Image />", () => {
  afterEach(() => {
    cleanup();
    clearImageUrlCache();
    fetchImage.mockReset();
  });

  it("renders a direct url immediately", () => {
    const { getByRole } = render(
      <ImgwireProvider config={{ apiKey: "ck_test", fetch }}>
        <Image
          alt="Example"
          url="https://cdn.imgwire.dev/example"
          width={400}
        />
      </ImgwireProvider>
    );

    expect(getByRole("img").getAttribute("src")).toBe(
      "https://cdn.imgwire.dev/example?width=400"
    );
  });

  it("uses the default loader for ids and caches the result", async () => {
    fetchImage.mockResolvedValue({
      cdn_url: "https://cdn.imgwire.dev/cached"
    });

    const view = render(
      <ImgwireProvider config={{ apiKey: "ck_test", fetch }}>
        <Image alt="Cached" id="img_123" />
      </ImgwireProvider>
    );

    expect((await view.findByRole("img")).getAttribute("src")).toBe(
      "https://cdn.imgwire.dev/cached"
    );

    view.rerender(
      <ImgwireProvider config={{ apiKey: "ck_test", fetch }}>
        <Image alt="Cached again" id="img_123" />
      </ImgwireProvider>
    );

    expect(fetchImage).toHaveBeenCalledTimes(1);
  });

  it("uses a custom loader when provided", async () => {
    const loader = vi.fn().mockResolvedValue({
      url: "https://cdn.imgwire.dev/from-loader"
    });

    const view = render(
      <ImgwireProvider config={{ apiKey: "ck_test", fetch }}>
        <Image alt="Loaded" id="img_123" loader={loader} />
      </ImgwireProvider>
    );

    expect((await view.findByRole("img")).getAttribute("src")).toBe(
      "https://cdn.imgwire.dev/from-loader"
    );
    expect(loader).toHaveBeenCalledWith("img_123");
    expect(fetchImage).not.toHaveBeenCalled();
  });

  it("renders nothing while an id-backed image is still resolving", () => {
    fetchImage.mockImplementation(() => new Promise(() => undefined));

    const view = render(
      <ImgwireProvider config={{ apiKey: "ck_test", fetch }}>
        <Image alt="Pending" id="img_123" />
      </ImgwireProvider>
    );

    expect(view.queryByRole("img")).toBeNull();
  });

  it("throws when neither id nor url is provided", () => {
    expect(() =>
      render(
        <ImgwireProvider config={{ apiKey: "ck_test", fetch }}>
          <Image alt="Invalid" />
        </ImgwireProvider>
      )
    ).toThrow("<Image /> requires either an id or a url.");
  });

  it("throws when image resolution fails", () => {
    fetchImage.mockRejectedValue(new Error("resolve failed"));

    expect(() =>
      render(
        <ImgwireProvider config={{ apiKey: "ck_test", fetch }}>
          <Image alt="Broken" id="img_123" />
        </ImgwireProvider>
      )
    ).not.toThrow();
  });
});
