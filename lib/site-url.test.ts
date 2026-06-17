import { describe, expect, it } from "vitest";

import { getPublicSiteUrl } from "./site-url";

describe("getPublicSiteUrl", () => {
  it("использует shell origin по умолчанию", () => {
    expect(getPublicSiteUrl(undefined)).toBe("http://localhost:3000");
  });

  it("нормализует origin без path и завершающего слеша", () => {
    expect(getPublicSiteUrl(" https://shop.example.com/catalog/ ")).toBe(
      "https://shop.example.com",
    );
  });

  it("возвращает локальный shell origin при некорректном URL", () => {
    expect(getPublicSiteUrl("localhost:3000")).toBe("http://localhost:3000");
  });
});
