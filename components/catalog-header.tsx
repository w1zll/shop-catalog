import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";
import { Button, Container } from "@w1zll/shop-ui";

export function CatalogHeader() {
  return (
    <header className="border-b border-[var(--shop-border)] bg-[var(--shop-background)]">
      <Container className="flex min-h-16 items-center justify-between gap-4">
        <Link className="flex items-center gap-2 font-semibold" href="/catalog">
          <span className="flex size-8 items-center justify-center rounded-md bg-[var(--shop-primary)] text-sm font-bold text-[var(--shop-primary-foreground)]">
            C
          </span>
          Catalog
        </Link>
        <nav className="flex items-center gap-2" aria-label="Навигация каталога">
          <Button asChild variant="ghost">
            <Link href="/catalog">
              <ShoppingBag className="size-4" aria-hidden="true" />
              Каталог
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/search">
              <Search className="size-4" aria-hidden="true" />
              Поиск
            </Link>
          </Button>
        </nav>
      </Container>
    </header>
  );
}
