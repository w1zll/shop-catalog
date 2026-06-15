import { Container } from "@w1zll/shop-ui";

import { RouteLoading } from "../../../components/route-loading";

export default function ProductLoading() {
  return (
    <Container className="py-12">
      <RouteLoading label="Загрузка товара" />
    </Container>
  );
}
