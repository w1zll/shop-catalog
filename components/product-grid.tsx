import { EmptyState } from "@w1zll/shop-ui";

import { Product } from "../lib/types";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: Product[];
  variant?: "default" | "featured";
}

export function ProductGrid({ products, variant = "default" }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        description="Попробуйте изменить категорию, поисковый запрос или фильтры."
        title="Товары не найдены"
      />
    );
  }

  return (
    <div
      className={
        variant === "featured"
          ? "grid gap-4 sm:grid-cols-3"
          : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      }
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
