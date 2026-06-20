import "server-only";

import { notFound } from "next/navigation";

import { createFallbackProductList, fallbackCategories, fallbackProducts } from "./fallback-data";
import { Category, Product, ProductList, ProductListQuery } from "./types";

const DEFAULT_API_INTERNAL_URL = "http://localhost:4000/api/v1";
const productListQueryKeys: Array<keyof ProductListQuery> = [
  "category",
  "search",
  "brand",
  "minPrice",
  "maxPrice",
  "inStock",
  "sort",
  "page",
  "limit",
];

function getApiInternalUrl() {
  return process.env.API_INTERNAL_URL ?? DEFAULT_API_INTERNAL_URL;
}

function buildUrl(path: string, query?: ProductListQuery) {
  const url = new URL(`${getApiInternalUrl()}${path}`);

  for (const key of productListQueryKeys) {
    const value = query?.[key];

    if (value && value.trim().length > 0) {
      url.searchParams.set(key, value);
    }
  }

  return url;
}

async function fetchJson<T>(path: string, query?: ProductListQuery): Promise<T> {
  const response = await fetch(buildUrl(path, query), {
    headers: {
      accept: "application/json",
    },
    next: {
      revalidate: 60,
    },
  });

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error(`Catalog API request failed: ${String(response.status)}`);
  }

  return (await response.json()) as T;
}

function filterFallbackProducts(query: ProductListQuery = {}) {
  const search = query.search?.trim().toLowerCase();
  const minPrice = query.minPrice ? Number(query.minPrice) : undefined;
  const maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined;

  return fallbackProducts.filter((product) => {
    if (query.category && product.category.slug !== query.category) {
      return false;
    }

    if (query.brand && product.brand.toLowerCase() !== query.brand.toLowerCase()) {
      return false;
    }

    if (minPrice !== undefined && product.priceCents < minPrice) {
      return false;
    }

    if (maxPrice !== undefined && product.priceCents > maxPrice) {
      return false;
    }

    if (query.inStock === "true" && product.stock <= 0) {
      return false;
    }

    if (query.inStock === "false" && product.stock > 0) {
      return false;
    }

    if (search) {
      const haystack = `${product.name} ${product.description} ${product.brand}`.toLowerCase();

      if (!haystack.includes(search)) {
        return false;
      }
    }

    return true;
  });
}

export async function getCategories(): Promise<Category[]> {
  try {
    return await fetchJson<Category[]>("/categories");
  } catch {
    return fallbackCategories;
  }
}

export async function getCategory(slug: string): Promise<Category> {
  try {
    return await fetchJson<Category>(`/categories/${slug}`);
  } catch {
    const category = fallbackCategories.find((item) => item.slug === slug);

    if (!category) {
      notFound();
    }

    return category;
  }
}

export async function getProducts(query: ProductListQuery = {}): Promise<ProductList> {
  try {
    return await fetchJson<ProductList>("/products", query);
  } catch {
    return createFallbackProductList(filterFallbackProducts(query), query);
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const response = await fetchJson<{ items: Product[] }>("/products/featured");
    return response.items;
  } catch {
    return fallbackProducts.filter((product) => product.isFeatured);
  }
}

export async function getProduct(slug: string): Promise<Product> {
  try {
    return await fetchJson<Product>(`/products/${slug}`);
  } catch {
    const product = fallbackProducts.find((item) => item.slug === slug);

    if (!product) {
      notFound();
    }

    return product;
  }
}
