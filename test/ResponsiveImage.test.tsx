import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ImgwireProvider } from "../src/provider/ImgwireProvider.tsx";
import { ResponsiveImage } from "../src/components/ResponsiveImage.tsx";

vi.mock("@imgwire/js", () => {
  class ImgwireClient {
    options: { apiKey: string; fetch?: typeof fetch };

    constructor(options: { apiKey: string; fetch?: typeof fetch }) {
      this.options = options;
    }
  }

  class ImageUrlBuilder {
    private image: { cdn_url: string };

    constructor(image: { cdn_url: string }) {
      this.image = image;
    }

    build(options?: { width?: number; dpr?: number }) {
      const params = new URLSearchParams();
      if (options?.width) {
        params.set("width", String(options.width));
      }
      if (options?.dpr) {
        params.set("dpr", String(options.dpr));
      }
      const query = params.toString();
      return query ? `${this.image.cdn_url}?${query}` : this.image.cdn_url;
    }
  }

  return {
    ImgwireClient,
    ImageUrlBuilder
  };
});

describe("<ResponsiveImage />", () => {
  it("builds srcset and sizes from breakpoints", () => {
    const { getByRole } = render(
      <ImgwireProvider config={{ apiKey: "ck_test", fetch }}>
        <ResponsiveImage
          alt="Responsive"
          url="https://cdn.imgwire.dev/example.jpg"
          breakpoints={{
            sm: { minWidth: 0, width: 320 },
            lg: { minWidth: 1024, width: 1024, dpr: [1, 2] }
          }}
        />
      </ImgwireProvider>
    );

    const image = getByRole("img");
    expect(image.getAttribute("sizes")).toBe(
      "(min-width: 1024px) 1024px, 320px"
    );
    expect(image.getAttribute("srcset")).toContain(
      "https://cdn.imgwire.dev/example.jpg?width=320&dpr=1 320w"
    );
    expect(image.getAttribute("srcset")).toContain(
      "https://cdn.imgwire.dev/example.jpg?width=1024&dpr=2 2048w"
    );
  });
});
