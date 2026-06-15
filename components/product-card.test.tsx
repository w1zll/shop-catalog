import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { fallbackProducts } from "../lib/fallback-data";
import { ProductCard } from "./product-card";

describe("ProductCard", () => {
  it("renders product data and product link", () => {
    const product = fallbackProducts[0];

    render(<ProductCard product={product} />);

    expect(screen.getByText(product.name)).toBeInTheDocument();
    expect(screen.getByText(product.brand)).toBeInTheDocument();
    expect(screen.getByText("В наличии")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Открыть" })).toHaveAttribute(
      "href",
      `/product/${product.slug}`,
    );
  });
});
