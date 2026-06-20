import { ProductListQuery } from "./types";

const productListUrlKeys: Array<keyof ProductListQuery> = [
  "search",
  "brand",
  "minPrice",
  "maxPrice",
  "inStock",
  "sort",
  "page",
  "limit",
];

export function buildProductListSearchParams(query: ProductListQuery) {
  const params = new URLSearchParams();

  for (const key of productListUrlKeys) {
    const value = query[key];

    if (value && value.trim().length > 0) {
      params.set(key, value);
    }
  }

  return params;
}

export function createProductListHref(
  pathname: string,
  query: ProductListQuery,
  patch: ProductListQuery = {},
  resetPage = true,
) {
  const nextQuery: ProductListQuery = {
    ...query,
    ...patch,
    ...(resetPage ? { page: undefined } : {}),
  };
  const params = buildProductListSearchParams(nextQuery);
  const search = params.toString();

  return search ? `${pathname}?${search}` : pathname;
}
