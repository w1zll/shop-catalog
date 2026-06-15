import { LoadingState } from "@w1zll/shop-ui";

interface RouteLoadingProps {
  label?: string;
}

export function RouteLoading({ label = "Загрузка каталога" }: RouteLoadingProps) {
  return <LoadingState label={label} />;
}
