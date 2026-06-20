"use client";

import { SyntheticEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Button, Input } from "@w1zll/shop-ui";

import { AvailableFilters, ProductListQuery } from "../lib/types";
import { createProductListHref } from "../lib/product-list-url";
import styles from "./catalog-controls.module.css";

const sortOptions = [
  { label: "Новые", value: "newest" },
  { label: "Сначала дешевле", value: "price-asc" },
  { label: "Сначала дороже", value: "price-desc" },
  { label: "По названию", value: "name-asc" },
] as const;

interface CatalogControlsProps {
  filters: AvailableFilters;
  pathname: string;
  query: ProductListQuery;
}

function centsToRubles(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    return "";
  }

  return String(Math.floor(parsedValue / 100));
}

function rublesToCents(value: string) {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return undefined;
  }

  return String(Math.round(parsedValue * 100));
}

export function CatalogControls({ filters, pathname, query }: CatalogControlsProps) {
  const router = useRouter();
  const [maxPrice, setMaxPrice] = useState(centsToRubles(query.maxPrice));
  const [minPrice, setMinPrice] = useState(centsToRubles(query.minPrice));

  useEffect(() => {
    setMaxPrice(centsToRubles(query.maxPrice));
    setMinPrice(centsToRubles(query.minPrice));
  }, [query.maxPrice, query.minPrice]);

  function updateQuery(patch: ProductListQuery) {
    router.push(createProductListHref(pathname, query, patch));
  }

  function applyPriceRange(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    updateQuery({
      maxPrice: rublesToCents(maxPrice),
      minPrice: rublesToCents(minPrice),
    });
  }

  function resetFilters() {
    router.push(pathname);
  }

  return (
    <aside className="space-y-5 rounded-lg border border-[var(--shop-border)] p-4">
      <div>
        <label className="text-sm font-semibold" htmlFor="catalog-sort">
          Сортировка
        </label>
        <select
          className="mt-3 h-10 w-full rounded-md border border-[var(--shop-border)] bg-[var(--shop-background)] px-3 text-sm"
          id="catalog-sort"
          value={query.sort ?? "newest"}
          onChange={(event) => {
            updateQuery({ sort: event.target.value as ProductListQuery["sort"] });
          }}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h2 className="text-sm font-semibold">Бренды</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {filters.brands.map((brand) => (
            <Button
              key={brand}
              type="button"
              size="sm"
              variant={query.brand === brand ? "primary" : "outline"}
              onClick={() => {
                updateQuery({ brand: query.brand === brand ? undefined : brand });
              }}
            >
              {brand}
            </Button>
          ))}
        </div>
      </div>

      <form className="space-y-3" onSubmit={applyPriceRange}>
        <h2 className="text-sm font-semibold">Цена</h2>
        <div className={styles.priceRangeGrid}>
          <Input
            inputMode="numeric"
            min={0}
            placeholder={
              filters.minPriceCents ? `от ${String(Math.floor(filters.minPriceCents / 100))}` : "от"
            }
            type="number"
            value={minPrice}
            onChange={(event) => {
              setMinPrice(event.target.value);
            }}
          />
          <Input
            inputMode="numeric"
            min={0}
            placeholder={
              filters.maxPriceCents ? `до ${String(Math.ceil(filters.maxPriceCents / 100))}` : "до"
            }
            type="number"
            value={maxPrice}
            onChange={(event) => {
              setMaxPrice(event.target.value);
            }}
          />
        </div>
        <Button className="w-full gap-2" size="sm" type="submit" variant="outline">
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          Применить
        </Button>
      </form>

      {filters.hasInStock ? (
        <label className="flex items-center gap-2 text-sm">
          <input
            checked={query.inStock === "true"}
            className="size-4"
            type="checkbox"
            onChange={(event) => {
              updateQuery({ inStock: event.target.checked ? "true" : undefined });
            }}
          />
          Только в наличии
        </label>
      ) : null}

      <Button className="w-full gap-2" size="sm" type="button" variant="ghost" onClick={resetFilters}>
        <X className="size-4" aria-hidden="true" />
        Сбросить
      </Button>
    </aside>
  );
}
