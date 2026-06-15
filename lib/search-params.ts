import { ProductListQuery } from "./types";

export type PageSearchParams = Promise<Record<string, string | string[] | undefined>>;

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function readProductListQuery(
  searchParams?: PageSearchParams,
): Promise<ProductListQuery> {
  const params = searchParams ? await searchParams : {};

  return {
    category: readParam(params.category),
    search: readParam(params.search) ?? readParam(params.q),
    brand: readParam(params.brand),
    minPrice: readParam(params.minPrice),
    maxPrice: readParam(params.maxPrice),
    inStock: readParam(params.inStock),
    sort: readParam(params.sort) as ProductListQuery["sort"],
    page: readParam(params.page),
    limit: readParam(params.limit),
  };
}
