import type { Metadata } from "next";

import type { Category, Product } from "./types";

const catalogDescription = "Серверный каталог товаров с категориями, фильтрами и сортировкой.";
const searchDescription = "Поиск товаров по каталогу.";

function getCategoryDescription(category: Category) {
  return category.description ?? `Товары категории ${category.name}.`;
}

export function createCatalogMetadata(isFilteredUrl: boolean): Metadata {
  return {
    title: "Каталог",
    description: catalogDescription,
    alternates: {
      canonical: "/catalog",
    },
    openGraph: {
      title: "Каталог",
      description: catalogDescription,
      url: "/catalog",
      type: "website",
    },
    robots: isFilteredUrl ? { follow: true, index: false } : undefined,
  };
}

export function createCategoryMetadata(category: Category, isFilteredUrl: boolean): Metadata {
  const description = getCategoryDescription(category);

  return {
    title: category.name,
    description,
    alternates: {
      canonical: `/category/${category.slug}`,
    },
    openGraph: {
      title: category.name,
      description,
      url: `/category/${category.slug}`,
      type: "website",
    },
    robots: isFilteredUrl ? { follow: true, index: false } : undefined,
  };
}

export function createProductMetadata(product: Product): Metadata {
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

export function createSearchMetadata(search: string | undefined): Metadata {
  const normalizedSearch = search?.trim();
  const title = normalizedSearch ? `Поиск: ${normalizedSearch}` : "Поиск";

  return {
    title,
    description: searchDescription,
    alternates: {
      canonical: "/search",
    },
    openGraph: {
      title,
      description: searchDescription,
      url: "/search",
      type: "website",
    },
    robots: {
      follow: true,
      index: false,
    },
  };
}

export function createCollectionPageJsonLd({
  description,
  name,
  numberOfItems,
}: Readonly<{ description?: string | null; name: string; numberOfItems: number }>) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    ...(description ? { description } : {}),
    numberOfItems,
  };
}

export function createProductJsonLd(product: Product) {
  return {
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
}

export function createSearchResultsPageJsonLd(search: string | undefined) {
  const normalizedSearch = search?.trim();

  return {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    name: normalizedSearch ? `Поиск: ${normalizedSearch}` : "Поиск",
  };
}
