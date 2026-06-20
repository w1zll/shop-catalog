import type { Route } from "next";
import Link from "next/link";
import { Button } from "@w1zll/shop-ui";

import { Pagination, ProductListQuery } from "../lib/types";
import { createProductListHref } from "../lib/product-list-url";

interface PaginationControlsProps {
  pagination: Pagination;
  query: ProductListQuery;
  pathname: string;
}

function createPageHref(pathname: string, query: ProductListQuery, page: number) {
  return createProductListHref(pathname, query, { page: String(page) }, false) as Route;
}

export function PaginationControls({ pagination, query, pathname }: PaginationControlsProps) {
  if (pagination.totalPages <= 1) {
    return null;
  }

  const previousPage = Math.max(1, pagination.page - 1);
  const nextPage = Math.min(pagination.totalPages, pagination.page + 1);

  return (
    <nav
      aria-label="Пагинация каталога"
      className="flex items-center justify-between gap-3 rounded-lg border border-[var(--shop-border)] p-3"
    >
      <Button asChild disabled={pagination.page <= 1} size="sm" variant="outline">
        <Link href={createPageHref(pathname, query, previousPage)}>Назад</Link>
      </Button>
      <span className="text-sm text-[var(--shop-muted-foreground)]">
        Страница {pagination.page} из {pagination.totalPages}
      </span>
      <Button
        asChild
        disabled={pagination.page >= pagination.totalPages}
        size="sm"
        variant="outline"
      >
        <Link href={createPageHref(pathname, query, nextPage)}>Вперед</Link>
      </Button>
    </nav>
  );
}
