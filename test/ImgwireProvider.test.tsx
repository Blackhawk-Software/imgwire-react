import type { ReactNode } from "react";
import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ImgwireProvider } from "../src/provider/ImgwireProvider.tsx";
import { useClient } from "../src/hooks/useClient.ts";

const imgwireConstructor = vi.fn();

vi.mock("@imgwire/js", () => {
  class ImgwireClient {
    options: Record<string, unknown>;

    constructor(options: Record<string, unknown>) {
      this.options = options;
      imgwireConstructor(options);
    }
  }

  return {
    ImgwireClient
  };
});

describe("<ImgwireProvider />", () => {
  afterEach(() => {
    imgwireConstructor.mockReset();
  });

  it("memoizes the client when config values are unchanged", () => {
    const config = {
      apiKey: "ck_provider",
      baseUrl: "http://localhost:8000",
      fetch
    };
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ImgwireProvider config={config}>{children}</ImgwireProvider>
    );

    const { result, rerender } = renderHook(() => useClient(), { wrapper });
    const firstClient = result.current;

    rerender();

    expect(result.current).toBe(firstClient);
    expect(imgwireConstructor).toHaveBeenCalledTimes(1);
  });

  it("recreates the client when a tracked config value changes", () => {
    let config = {
      apiKey: "ck_provider",
      baseUrl: "http://localhost:8000",
      fetch
    };
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ImgwireProvider config={config}>{children}</ImgwireProvider>
    );

    const { result, rerender } = renderHook(() => useClient(), { wrapper });
    const firstClient = result.current;

    config = { ...config, apiKey: "ck_updated" };
    rerender();

    expect(result.current).not.toBe(firstClient);
    expect(imgwireConstructor).toHaveBeenCalledTimes(2);
  });
});
