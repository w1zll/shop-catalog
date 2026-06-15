"use client";

import { Container } from "@w1zll/shop-ui";

import { RouteError } from "../../components/route-error";

interface SearchErrorProps {
  reset: () => void;
}

export default function SearchError({ reset }: SearchErrorProps) {
  return (
    <Container className="py-12">
      <RouteError reset={reset} title="Не удалось выполнить поиск" />
    </Container>
  );
}
