import { ProductListQuery } from "./types";

export type PageSearchParams = Promise<Record<string, string | string[] | undefined>>;

const productSortValues = new Set<ProductListQuery["sort"]>([
  "newest",
  "price-asc",
  "price-desc",
  "name-asc",
]);

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function readTextParam(value: string | string[] | undefined) {
  const text = readParam(value)?.trim();

  return text && text.length > 0 ? text : undefined;
}

function readIntegerParam(value: string | string[] | undefined) {
  const text = readTextParam(value);

  if (!text || !/^\d+$/.test(text)) {
    return undefined;
  }

  return text;
}

function readBooleanParam(value: string | string[] | undefined) {
  const text = readTextParam(value);

  return text === "true" || text === "false" ? text : undefined;
}

function readSortParam(value: string | string[] | undefined) {
  const sort = readTextParam(value) as ProductListQuery["sort"];

  return sort && productSortValues.has(sort) ? sort : undefined;
}

export async function readProductListQuery(
  searchParams?: PageSearchParams,
): Promise<ProductListQuery> {
  const params = searchParams ? await searchParams : {};

  return {
    category: readTextParam(params.category),
    search: readTextParam(params.search) ?? readTextParam(params.q),
    brand: readTextParam(params.brand),
    minPrice: readIntegerParam(params.minPrice),
    maxPrice: readIntegerParam(params.maxPrice),
    inStock: readBooleanParam(params.inStock),
    sort: readSortParam(params.sort),
    page: readIntegerParam(params.page),
    limit: readIntegerParam(params.limit),
  };
}

export function hasProductListUrlState(query: ProductListQuery) {
  return Boolean(
    query.search ||
      query.brand ||
      query.minPrice ||
      query.maxPrice ||
      query.inStock ||
      query.sort ||
      query.page ||
      query.limit,
  );
}
