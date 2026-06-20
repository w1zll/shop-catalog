import { describe, expect, it, vi } from "vitest";

import {
  DEFAULT_ACCOUNT_MANIFEST_URL,
  DEFAULT_CART_MANIFEST_URL,
  getAccountManifestUrl,
  getCartManifestUrl,
} from "./config";

describe("module federation config", () => {
  it("uses local manifest URLs by default", () => {
    vi.stubEnv("NEXT_PUBLIC_CART_MANIFEST_URL", "");
    vi.stubEnv("NEXT_PUBLIC_ACCOUNT_MANIFEST_URL", " ");

    expect(getCartManifestUrl()).toBe(DEFAULT_CART_MANIFEST_URL);
    expect(getAccountManifestUrl()).toBe(DEFAULT_ACCOUNT_MANIFEST_URL);
  });

  it("reads manifest URLs from the environment", () => {
    vi.stubEnv("NEXT_PUBLIC_CART_MANIFEST_URL", "http://localhost:4102/mf-manifest.json");
    vi.stubEnv("NEXT_PUBLIC_ACCOUNT_MANIFEST_URL", "http://localhost:4103/mf-manifest.json");

    expect(getCartManifestUrl()).toBe("http://localhost:4102/mf-manifest.json");
    expect(getAccountManifestUrl()).toBe("http://localhost:4103/mf-manifest.json");
  });
});
