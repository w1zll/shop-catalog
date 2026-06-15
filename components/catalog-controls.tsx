import Link from "next/link";
import { Button } from "@w1zll/shop-ui";

import { AvailableFilters, ProductListQuery } from "../lib/types";

const sortOptions = [
  { label: "Новые", value: "newest" },
  { label: "Сначала дешевле", value: "price-asc" },
  { label: "Сначала дороже", value: "price-desc" },
  { label: "По названию", value: "name-asc" },
] as const;

interface CatalogControlsProps {
  filters: AvailableFilters;
  query: ProductListQuery;
}

function createHref(query: ProductListQuery, patch: ProductListQuery) {
  const params = new URLSearchParams();
  const nextQuery = { ...query, ...patch, page: "1" };

  for (const [key, value] of Object.entries(nextQuery)) {
    if (value) {
      params.set(key, value);
    }
  }

  const search = params.toString();
  return search ? `/catalog?${search}` : "/catalog";
}

export function CatalogControls({ filters, query }: CatalogControlsProps) {
  return (
    <aside className="space-y-5 rounded-lg border border-[var(--shop-border)] p-4">
      <div>
        <h2 className="text-sm font-semibold">Сортировка</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {sortOptions.map((option) => (
            <Button
              key={option.value}
              asChild
              size="sm"
              variant={query.sort === option.value ? "primary" : "outline"}
            >
              <Link href={createHref(query, { sort: option.value })}>{option.label}</Link>
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold">Бренды</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {filters.brands.map((brand) => (
            <Button
              key={brand}
              asChild
              size="sm"
              variant={query.brand === brand ? "primary" : "outline"}
            >
              <Link href={createHref(query, { brand })}>{brand}</Link>
            </Button>
          ))}
        </div>
      </div>

      <p className="text-xs leading-5 text-[var(--shop-muted-foreground)]">
        Фильтры пока работают через URL и серверный рендер. Интерактивные controls появятся позже,
        когда подключим cart remote и клиентское состояние.
      </p>
    </aside>
  );
}
