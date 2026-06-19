import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Button, Container } from "@w1zll/shop-ui";

import { CatalogControls } from "../../components/catalog-controls";
import { PaginationControls } from "../../components/pagination-controls";
import { ProductGrid } from "../../components/product-grid";
import { getCategories, getFeaturedProducts, getProducts } from "../../lib/api-client";
import { PageSearchParams, readProductListQuery } from "../../lib/search-params";

interface CatalogPageProps {
  searchParams?: PageSearchParams;
}

export const metadata: Metadata = {
  title: "Каталог",
  description: "Серверный каталог товаров с категориями, фильтрами и сортировкой.",
  alternates: {
    canonical: "/catalog",
  },
  openGraph: {
    title: "Каталог",
    description: "Серверный каталог товаров с категориями, фильтрами и сортировкой.",
    url: "/catalog",
    type: "website",
  },
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const query = await readProductListQuery(searchParams);
  const [categories, products, featuredProducts] = await Promise.all([
    getCategories(),
    getProducts(query),
    getFeaturedProducts(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Каталог",
    numberOfItems: products.pagination.total,
  };

  return (
    <Container className="space-y-8 py-8">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <section className="space-y-4">
        <div className="max-w-3xl space-y-3">
          <Badge variant="secondary">Catalog zone</Badge>
          <h1 className="text-3xl font-semibold tracking-normal text-[var(--shop-foreground)]">
            Каталог товаров
          </h1>
          <p className="text-base leading-7 text-[var(--shop-muted-foreground)]">
            Серверная витрина с категориями, поиском, сортировкой и fallback-данными для локальной
            разработки без API.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button key={category.id} asChild size="sm" variant="outline">
              <Link href={`/category/${category.slug}`}>{category.name}</Link>
            </Button>
          ))}
        </div>
      </section>

      {featuredProducts.length > 0 && !query.search && !query.category ? (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Рекомендуемые товары</h2>
          <ProductGrid products={featuredProducts.slice(0, 3)} variant="featured" />
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <CatalogControls filters={products.availableFilters} query={query} />
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Все товары</h2>
            <span className="text-sm text-[var(--shop-muted-foreground)]">
              Найдено: {products.pagination.total}
            </span>
          </div>
          <ProductGrid products={products.items} />
          <PaginationControls pagination={products.pagination} pathname="/catalog" query={query} />
        </div>
      </section>
    </Container>
  );
}
