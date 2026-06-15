import { describe, expect, it } from "vitest";

import { readProductListQuery } from "./search-params";

describe("readProductListQuery", () => {
  it("normalizes supported URL parameters", async () => {
    await expect(
      readProductListQuery(
        Promise.resolve({
          brand: "AirBeat",
          category: "electronics",
          page: "2",
          q: "headphones",
          sort: "price-asc",
        }),
      ),
    ).resolves.toEqual({
      brand: "AirBeat",
      category: "electronics",
      inStock: undefined,
      limit: undefined,
      maxPrice: undefined,
      minPrice: undefined,
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
});
