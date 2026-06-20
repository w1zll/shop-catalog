import { EmptyState } from "@w1zll/shop-ui";

import { Product } from "../lib/types";
import { ProductCard } from "./product-card";
import styles from "./product-grid.module.css";

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
    <div className={variant === "featured" ? styles.featuredProductGrid : styles.productGrid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
