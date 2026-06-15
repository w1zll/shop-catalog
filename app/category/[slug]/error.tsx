"use client";

import { Container } from "@w1zll/shop-ui";

import { RouteError } from "../../../components/route-error";

interface CategoryErrorProps {
  reset: () => void;
}

export default function CategoryError({ reset }: CategoryErrorProps) {
  return (
    <Container className="py-12">
      <RouteError reset={reset} title="Не удалось загрузить категорию" />
    </Container>
  );
}
