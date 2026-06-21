import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";
import { Button, Container, Logo } from "@w1zll/shop-ui";

import { AccountBadgeRemote, AccountMenuRemote } from "./remotes/account-remotes";
import { CartIndicatorRemote } from "./remotes/cart-remotes";

const navItems = [
  { href: "/catalog", label: "Каталог", zone: "catalog" },
  { href: "/search", label: "Поиск", zone: "catalog" },
  { href: "/cart", label: "Корзина", zone: "shell" },
  { href: "/account", label: "Аккаунт", zone: "shell" },
] as const;

export function CatalogHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--shop-border)] bg-[var(--shop-background)]/95 backdrop-blur">
      <Container className="flex min-h-16 items-center justify-between gap-4">
        <a href="/" aria-label="На главную">
          <Logo />
        </a>

        <nav className="catalog-desktop-nav" aria-label="Основная навигация">
          {navItems.map((item) => (
            <Button key={item.href} asChild variant="ghost">
              {item.zone === "catalog" ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <a href={item.href}>{item.label}</a>
              )}
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild className="size-10 cursor-pointer p-0" variant="ghost">
            <Link href="/search" aria-label="Поиск">
              <Search className="size-4" aria-hidden="true" />
            </Link>
          </Button>
          <AccountMenuRemote />
          <CartIndicatorRemote />
          <AccountBadgeRemote />
          <div className="catalog-lg-up">
            <Button asChild className="gap-2" variant="ghost">
              <Link href="/catalog">
                <ShoppingBag className="size-4" aria-hidden="true" />
                Витрина
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}
