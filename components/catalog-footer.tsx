import { Container } from "@w1zll/shop-ui";

export function CatalogFooter() {
  return (
    <footer className="border-t border-[var(--shop-border)] bg-[var(--shop-secondary)]/50">
      <Container className="py-6 text-sm text-[var(--shop-muted-foreground)]">
        Catalog zone отвечает за серверный контент товаров, категорий и поиска.
      </Container>
    </footer>
  );
}
