"use client";

import { Container } from "@w1zll/shop-ui";

import { RouteError } from "../../../components/route-error";

interface ProductErrorProps {
  reset: () => void;
}

export default function ProductError({ reset }: ProductErrorProps) {
  return (
    <Container className="py-12">
      <RouteError reset={reset} title="Не удалось загрузить товар" />
    </Container>
  );
}
