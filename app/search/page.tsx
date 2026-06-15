import type { Metadata } from "next";
import { Button, Container, EmptyState, Input } from "@w1zll/shop-ui";

import { PaginationControls } from "../../components/pagination-controls";
import { ProductGrid } from "../../components/product-grid";
import { getProducts } from "../../lib/api-client";
import { PageSearchParams, readProductListQuery } from "../../lib/search-params";

interface SearchPageProps {
  searchParams?: PageSearchParams;
}

export const metadata: Metadata = {
  title: "Поиск",
  description: "Поиск товаров по каталогу.",
  alternates: {
    canonical: "/search",
  },
  openGraph: {
    title: "Поиск",
    description: "Поиск товаров по каталогу.",
    url: "/search",
    type: "website",
  },
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = await readProductListQuery(searchParams);
  const search = query.search?.trim();
  const products = search ? await getProducts(query) : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    name: search ? `Поиск: ${search}` : "Поиск",
  };

  return (
    <Container className="space-y-8 py-8">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <section className="max-w-3xl space-y-3">
        <h1 className="text-3xl font-semibold tracking-normal">Поиск по каталогу</h1>
        <p className="text-base leading-7 text-[var(--shop-muted-foreground)]">
          Серверный поиск по названию, описанию и бренду товара.
        </p>
      </section>

      <form action="/search" className="flex max-w-2xl gap-2" method="get">
        <Input
          aria-label="Поисковый запрос"
          defaultValue={search}
          name="search"
          placeholder="Например, наушники"
        />
        <Button type="submit">Найти</Button>
      </form>

      {products ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Результаты</h2>
            <span className="text-sm text-[var(--shop-muted-foreground)]">
              Найдено: {products.pagination.total}
            </span>
          </div>
          <ProductGrid products={products.items} />
          <PaginationControls pagination={products.pagination} pathname="/search" query={query} />
        </section>
      ) : (
        <EmptyState
          description="Введите название, бренд или часть описания товара."
          title="Начните поиск"
        />
      )}
    </Container>
  );
}
