import Link from "next/link";
import { Button, Container, EmptyState } from "@w1zll/shop-ui";

export default function NotFoundPage() {
  return (
    <Container className="py-12">
      <EmptyState
        action={
          <Button asChild variant="outline">
            <Link href="/catalog">Вернуться в каталог</Link>
          </Button>
        }
        description="Такого товара, категории или страницы нет в catalog zone."
        title="Страница не найдена"
      />
    </Container>
  );
}
