import { describe, expect, it, vi } from "vitest";

import { DEFAULT_CART_MANIFEST_URL, getCartManifestUrl } from "./config";

describe("module federation config", () => {
  it("использует локальный cart manifest URL по умолчанию", () => {
    vi.stubEnv("NEXT_PUBLIC_CART_MANIFEST_URL", "");

    expect(getCartManifestUrl()).toBe(DEFAULT_CART_MANIFEST_URL);
  });

  it("читает cart manifest URL из окружения", () => {
    vi.stubEnv("NEXT_PUBLIC_CART_MANIFEST_URL", "http://localhost:4102/mf-manifest.json");

    expect(getCartManifestUrl()).toBe("http://localhost:4102/mf-manifest.json");
  });
});
