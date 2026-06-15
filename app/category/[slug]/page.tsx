import type { Metadata } from "next";
import { Badge, Container } from "@w1zll/shop-ui";

import { CatalogControls } from "../../../components/catalog-controls";
import { PaginationControls } from "../../../components/pagination-controls";
import { ProductGrid } from "../../../components/product-grid";
import { getCategory, getProducts } from "../../../lib/api-client";
import { PageSearchParams, readProductListQuery } from "../../../lib/search-params";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: PageSearchParams;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);

  return {
    title: category.name,
    description: category.description ?? `Товары категории ${category.name}.`,
    alternates: {
      canonical: `/category/${category.slug}`,
    },
    openGraph: {
      title: category.name,
      description: category.description ?? `Товары категории ${category.name}.`,
      url: `/category/${category.slug}`,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategory(slug);
  const query = {
    ...(await readProductListQuery(searchParams)),
    category: slug,
  };
  const products = await getProducts(query);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description,
    numberOfItems: products.pagination.total,
  };

  return (
    <Container className="space-y-8 py-8">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <section className="max-w-3xl space-y-3">
        <Badge variant="secondary">Категория</Badge>
        <h1 className="text-3xl font-semibold tracking-normal">{category.name}</h1>
        {category.description ? (
          <p className="text-base leading-7 text-[var(--shop-muted-foreground)]">
            {category.description}
          </p>
        ) : null}
      </section>

      <section className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <CatalogControls filters={products.availableFilters} query={query} />
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Товары категории</h2>
            <span className="text-sm text-[var(--shop-muted-foreground)]">
              Найдено: {products.pagination.total}
            </span>
          </div>
          <ProductGrid products={products.items} />
          <PaginationControls
            pagination={products.pagination}
            pathname={`/category/${category.slug}`}
            query={query}
          />
        </div>
      </section>
    </Container>
  );
}
