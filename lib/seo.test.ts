import { describe, expect, it } from "vitest";

import {
  createCatalogMetadata,
  createCategoryMetadata,
  createCollectionPageJsonLd,
  createProductJsonLd,
  createProductMetadata,
  createSearchMetadata,
  createSearchResultsPageJsonLd,
} from "./seo";
import type { Category, Product } from "./types";

const category: Category = {
  id: "books",
  name: "Books",
  slug: "books",
  description: null,
  imageUrl: null,
  parentId: null,
  productsCount: 3,
};

const product: Product = {
  id: "clean-architecture-book",
  name: "Clean Architecture",
  slug: "clean-architecture-book",
  description: "A book about maintainable boundaries.",
  brand: "TechBooks",
  priceCents: 249000,
  oldPriceCents: null,
  stock: 7,
  isFeatured: true,
  attributes: {},
  category: {
    id: "books",
    name: "Books",
    slug: "books",
  },
  images: [
    {
      alt: "Book cover",
      id: "cover",
      position: 0,
      url: "https://example.com/cover.jpg",
    },
  ],
};

describe("metadata builders", () => {
  it("builds catalog metadata and noindexes filtered catalog URLs", () => {
    expect(createCatalogMetadata(false)).toMatchObject({
      alternates: { canonical: "/catalog" },
      robots: undefined,
      title: "Каталог",
    });

    expect(createCatalogMetadata(true)).toMatchObject({
      robots: { follow: true, index: false },
    });
  });

  it("builds category metadata with fallback description and canonical URL", () => {
    expect(createCategoryMetadata(category, true)).toMatchObject({
      alternates: { canonical: "/category/books" },
      description: "Товары категории Books.",
      openGraph: {
        description: "Товары категории Books.",
        title: "Books",
        type: "website",
        url: "/category/books",
      },
      robots: { follow: true, index: false },
      title: "Books",
    });
  });

  it("builds product metadata with canonical URL", () => {
    expect(createProductMetadata(product)).toMatchObject({
      alternates: { canonical: "/product/clean-architecture-book" },
      description: product.description,
      openGraph: {
        description: product.description,
        title: product.name,
        type: "website",
        url: "/product/clean-architecture-book",
      },
      title: product.name,
    });
  });

  it("builds search metadata with normalized title and noindex robots", () => {
    expect(createSearchMetadata("  laptop  ")).toMatchObject({
      alternates: { canonical: "/search" },
      robots: { follow: true, index: false },
      title: "Поиск: laptop",
    });

    expect(createSearchMetadata(undefined)).toMatchObject({
      title: "Поиск",
    });
  });
});

describe("JSON-LD builders", () => {
  it("builds collection page JSON-LD and omits empty descriptions", () => {
    expect(
      createCollectionPageJsonLd({
        description: "",
        name: "Catalog",
        numberOfItems: 0,
      }),
    ).toEqual({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Catalog",
      numberOfItems: 0,
    });

    expect(
      createCollectionPageJsonLd({
        description: "Books and magazines.",
        name: "Books",
        numberOfItems: 3,
      }),
    ).toMatchObject({
      description: "Books and magazines.",
    });
  });

  it("builds product JSON-LD with offer data and images", () => {
    expect(createProductJsonLd(product)).toEqual({
      "@context": "https://schema.org",
      "@type": "Product",
      brand: "TechBooks",
      category: "Books",
      description: product.description,
      image: ["https://example.com/cover.jpg"],
      name: "Clean Architecture",
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        price: 2490,
        priceCurrency: "RUB",
      },
      sku: "clean-architecture-book",
    });

    expect(createProductJsonLd({ ...product, stock: 0 }).offers.availability).toBe(
      "https://schema.org/OutOfStock",
    );
  });

  it("builds search results JSON-LD with normalized search text", () => {
    expect(createSearchResultsPageJsonLd("  lamp  ")).toEqual({
      "@context": "https://schema.org",
      "@type": "SearchResultsPage",
      name: "Поиск: lamp",
    });
  });
});
