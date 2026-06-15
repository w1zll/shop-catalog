"use client";

import { Container } from "@w1zll/shop-ui";

import { RouteError } from "../../components/route-error";

interface CatalogErrorProps {
  reset: () => void;
}

export default function CatalogError({ reset }: CatalogErrorProps) {
  return (
    <Container className="py-12">
      <RouteError reset={reset} />
    </Container>
  );
}
