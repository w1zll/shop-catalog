export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  parentId: string | null;
  productsCount: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  position: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  priceCents: number;
  oldPriceCents: number | null;
  stock: number;
  isFeatured: boolean;
  attributes: unknown;
  category: ProductCategory;
  images: ProductImage[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AvailableFilters {
  brands: string[];
  minPriceCents: number | null;
  maxPriceCents: number | null;
  hasInStock: boolean;
}

export interface ProductList {
  items: Product[];
  pagination: Pagination;
  availableFilters: AvailableFilters;
}

export interface ProductListQuery {
  category?: string;
  search?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
  sort?: "newest" | "price-asc" | "price-desc" | "name-asc";
  page?: string;
  limit?: string;
}
