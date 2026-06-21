import type { Metadata } from "next";
import { Container, EmptyState } from "@w1zll/shop-ui";

import { PaginationControls } from "../../components/pagination-controls";
import { ProductGrid } from "../../components/product-grid";
import { SearchBox } from "../../components/search-box";
import { getProducts } from "../../lib/api-client";
import { PageSearchParams, readProductListQuery } from "../../lib/search-params";
import { createSearchMetadata, createSearchResultsPageJsonLd } from "../../lib/seo";

interface SearchPageProps {
  searchParams?: PageSearchParams;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const query = await readProductListQuery(searchParams);
  const search = query.search?.trim();

  return createSearchMetadata(search);
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = await readProductListQuery(searchParams);
  const search = query.search?.trim();
  const products = search ? await getProducts(query) : null;

  const jsonLd = createSearchResultsPageJsonLd(search);

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

      <SearchBox initialValue={search ?? ""} />

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
