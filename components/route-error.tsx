"use client";

import { ErrorState } from "@w1zll/shop-ui";

interface RouteErrorProps {
  reset: () => void;
  title?: string;
}

export function RouteError({ reset, title = "Не удалось загрузить каталог" }: RouteErrorProps) {
  return (
    <ErrorState
      description="Попробуйте повторить запрос. Если ошибка останется, проверьте доступность API."
      onRetry={reset}
      retryLabel="Повторить"
      title={title}
    />
  );
}
