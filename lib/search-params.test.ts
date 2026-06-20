import { describe, expect, it } from "vitest";

import { hasProductListUrlState, readProductListQuery } from "./search-params";

describe("readProductListQuery", () => {
  it("normalizes supported URL parameters", async () => {
    await expect(
      readProductListQuery(
        Promise.resolve({
          brand: "AirBeat",
          category: "electronics",
          inStock: "true",
          limit: "24",
          maxPrice: "900000",
          minPrice: "100000",
          page: "2",
          q: "headphones",
          sort: "price-asc",
        }),
      ),
    ).resolves.toEqual({
      brand: "AirBeat",
      category: "electronics",
      inStock: "true",
      limit: "24",
      maxPrice: "900000",
      minPrice: "100000",
      page: "2",
      search: "headphones",
      sort: "price-asc",
    });
  });

  it("prefers search over q", async () => {
    await expect(
      readProductListQuery(Promise.resolve({ q: "watch", search: "lamp" })),
    ).resolves.toMatchObject({
      search: "lamp",
    });
  });

  it("drops empty and unsupported URL parameters", async () => {
    await expect(
      readProductListQuery(
        Promise.resolve({
          brand: " ",
          inStock: "yes",
          limit: "-1",
          maxPrice: "10.5",
          minPrice: "free",
          page: "two",
          search: "",
          sort: "popular",
        }),
      ),
    ).resolves.toEqual({
      brand: undefined,
      category: undefined,
      inStock: undefined,
      limit: undefined,
      maxPrice: undefined,
      minPrice: undefined,
      page: undefined,
      search: undefined,
      sort: undefined,
    });
  });

  it("detects product list URL state that should be noindexed", () => {
    expect(hasProductListUrlState({})).toBe(false);
    expect(hasProductListUrlState({ brand: "AirBeat" })).toBe(true);
    expect(hasProductListUrlState({ category: "electronics" })).toBe(false);
    expect(hasProductListUrlState({ page: "2" })).toBe(true);
  });
});
