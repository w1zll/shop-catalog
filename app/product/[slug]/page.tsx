import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Button, Card, CardContent, Container, Price } from "@w1zll/shop-ui";

import { FavoriteButton } from "../../../components/favorite-button";
import { ProductMedia } from "../../../components/product-media";
import { AddToCartButtonRemote } from "../../../components/remotes/cart-remotes";
import { getProduct } from "../../../lib/api-client";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  return {
    title: product.name,
    description: product.description,
    alternates: {
      canonical: `/product/${product.slug}`,
    },
    openGraph: {
      title: product.name,
      description: product.description,
      url: `/product/${product.slug}`,
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  const primaryImage = product.images.length > 0 ? product.images[0] : undefined;
  const imageLabel = primaryImage?.alt || product.category.name;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: product.brand,
    sku: product.id,
    category: product.category.name,
    image: product.images.map((image) => image.url),
    offers: {
      "@type": "Offer",
      price: product.priceCents / 100,
      priceCurrency: "RUB",
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <Container className="space-y-8 py-8">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <section className="space-y-4">
          <ProductMedia
            className="aspect-[4/3] rounded-lg border border-[var(--shop-border)] text-base"
            fallbackLabel={imageLabel}
            image={primaryImage}
            loading="eager"
          />
          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((item) => (
              <ProductMedia
                key={product.images[item]?.id ?? item}
                className="aspect-square rounded-md border border-[var(--shop-border)]"
                fallbackLabel=""
                image={product.images[item]}
              />
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{product.brand}</Badge>
              <Badge variant={product.stock > 0 ? "secondary" : "outline"}>
                {product.stock > 0 ? "В наличии" : "Нет в наличии"}
              </Badge>
            </div>
            <h1 className="text-3xl font-semibold tracking-normal">{product.name}</h1>
            <p className="text-base leading-7 text-[var(--shop-muted-foreground)]">
              {product.description}
            </p>
          </div>

          <Card>
            <CardContent className="space-y-4 p-5">
              <div className="flex items-end justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-[var(--shop-muted-foreground)]">Цена</p>
                  <Price className="text-2xl font-semibold" valueCents={product.priceCents} />
                </div>
                {product.oldPriceCents ? (
                  <Price
                    className="text-sm text-[var(--shop-muted-foreground)] line-through"
                    valueCents={product.oldPriceCents}
                  />
                ) : null}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <AddToCartButtonRemote
                  className="w-full"
                  disabled={product.stock <= 0}
                  maxQuantity={product.stock}
                  productId={product.id}
                />
                <FavoriteButton productId={product.id} />
              </div>
              <p className="text-xs leading-5 text-[var(--shop-muted-foreground)]">
                SEO-контент страницы отрендерен сервером, а добавление в корзину загружается через
                cart remote. Избранное работает через account API с same-origin запросами.
              </p>
            </CardContent>
          </Card>

          <Button asChild variant="ghost">
            <Link href={`/category/${product.category.slug}`}>
              Все товары категории {product.category.name}
            </Link>
          </Button>
        </section>
      </div>
    </Container>
  );
}
