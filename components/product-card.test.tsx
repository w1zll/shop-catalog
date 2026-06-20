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

  it("renders product image when image URL is available", () => {
    const product = {
      ...fallbackProducts[0],
      images: [
        {
          alt: "Product photo",
          id: "image-1",
          position: 0,
          url: "https://example.com/product.jpg",
        },
      ],
    };

    render(<ProductCard product={product} />);

    expect(screen.getByRole("img", { name: "Product photo" })).toHaveAttribute(
      "src",
      "https://example.com/product.jpg",
    );
  });
});
