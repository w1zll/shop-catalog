import { describe, expect, it } from "vitest";

import { buildProductListSearchParams, createProductListHref } from "./product-list-url";

describe("product list URL helpers", () => {
  it("builds search params from supported product list query keys", () => {
    const params = buildProductListSearchParams({
      brand: "AirBeat",
      category: "electronics",
      inStock: "true",
      page: "2",
      search: "наушники",
      sort: "price-asc",
    });

    expect(params.toString()).toBe(
      "search=%D0%BD%D0%B0%D1%83%D1%88%D0%BD%D0%B8%D0%BA%D0%B8&brand=AirBeat&inStock=true&sort=price-asc&page=2",
    );
  });

  it("creates href and resets page for filter changes", () => {
    expect(
      createProductListHref(
        "/catalog",
        { brand: "AirBeat", page: "3", search: "phone" },
        { brand: "Pulse" },
      ),
    ).toBe("/catalog?search=phone&brand=Pulse");
  });

  it("keeps page for pagination links", () => {
    expect(createProductListHref("/catalog", { brand: "AirBeat" }, { page: "2" }, false)).toBe(
      "/catalog?brand=AirBeat&page=2",
    );
  });
});
