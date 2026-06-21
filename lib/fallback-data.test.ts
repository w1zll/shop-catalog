import { describe, expect, it } from "vitest";

import { createFallbackProductList, fallbackProducts } from "./fallback-data";

describe("createFallbackProductList", () => {
  it("sorts products before paginating fallback data", () => {
    const productList = createFallbackProductList(fallbackProducts, {
      limit: "2",
      page: "2",
      sort: "price-asc",
    });

    expect(productList.items.map((product) => product.id)).toEqual([
      "airbeat-lite-headphones",
      "pulse-pro-smartwatch",
    ]);
    expect(productList.pagination).toEqual({
      limit: 2,
      page: 2,
      total: 4,
      totalPages: 2,
    });
  });

  it("falls back to safe pagination values for invalid query params", () => {
    expect(
      createFallbackProductList(fallbackProducts, {
        limit: "-1",
        page: "0",
      }).pagination,
    ).toEqual({
      limit: 4,
      page: 1,
      total: 4,
      totalPages: 1,
    });
  });

  it("builds available filters from fallback products", () => {
    expect(createFallbackProductList(fallbackProducts).availableFilters).toEqual({
      brands: ["AirBeat", "Glow", "Grip Mat", "Pulse"],
      hasInStock: true,
      maxPriceCents: 1299000,
      minPriceCents: 259000,
    });
  });

  it("handles empty fallback data", () => {
    expect(createFallbackProductList([])).toEqual({
      availableFilters: {
        brands: [],
        hasInStock: false,
        maxPriceCents: null,
        minPriceCents: null,
      },
      items: [],
      pagination: {
        limit: 12,
        page: 1,
        total: 0,
        totalPages: 0,
      },
    });
  });
});
