import { Container } from "@w1zll/shop-ui";

import { RouteLoading } from "../../../components/route-loading";

export default function CategoryLoading() {
  return (
    <Container className="py-12">
      <RouteLoading label="Загрузка категории" />
    </Container>
  );
}
