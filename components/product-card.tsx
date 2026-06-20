import Link from "next/link";
import { Badge, Button, Card, CardContent, Price } from "@w1zll/shop-ui";

import { Product } from "../lib/types";
import { ProductMedia } from "./product-media";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images.length > 0 ? product.images[0] : undefined;
  const imageLabel = primaryImage?.alt || product.category.name;

  return (
    <Card className="overflow-hidden">
      <CardContent className="flex h-full flex-col gap-4 p-4">
        <ProductMedia
          className="aspect-[4/3] rounded-md"
          fallbackLabel={imageLabel}
          image={primaryImage}
        />
        <div className="flex flex-1 flex-col gap-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Badge variant="outline">{product.brand}</Badge>
              {product.stock > 0 ? (
                <span className="text-xs text-emerald-700">В наличии</span>
              ) : (
                <span className="text-xs text-[var(--shop-muted-foreground)]">Нет в наличии</span>
              )}
            </div>
            <h2 className="min-h-12 text-sm font-semibold leading-6 text-[var(--shop-foreground)]">
              {product.name}
            </h2>
            <p className="line-clamp-2 text-xs leading-5 text-[var(--shop-muted-foreground)]">
              {product.description}
            </p>
          </div>
          <div className="mt-auto flex items-center justify-between gap-3">
            <Price className="text-base font-semibold" valueCents={product.priceCents} />
            <Button asChild size="sm" variant="outline">
              <Link href={`/product/${product.slug}`}>Открыть</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
