"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@w1zll/shop-ui";

const API_BASE_URL = "/api/v1";
const unsafeMethods = new Set(["POST", "PATCH", "PUT", "DELETE"]);

let csrfToken: string | null = null;
let refreshPromise: Promise<void> | null = null;

type FavoritesResponse = {
  items: Array<{
    productId: string;
  }>;
};

class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function ensureCsrfToken() {
  if (csrfToken) {
    return csrfToken;
  }

  const response = await fetch(`${API_BASE_URL}/auth/csrf`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new ApiError("Не удалось получить CSRF-токен", response.status);
  }

  const body = (await response.json()) as { csrfToken?: string };

  if (!body.csrfToken) {
    throw new Error("API вернул пустой CSRF-токен");
  }

  csrfToken = body.csrfToken;
  return csrfToken;
}

async function refreshAccessToken() {
  refreshPromise ??= (async () => {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      credentials: "include",
      headers: {
        "X-CSRF-Token": await ensureCsrfToken(),
      },
      method: "POST",
    });

    if (!response.ok) {
      throw new ApiError("Не удалось обновить сессию", response.status);
    }
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

async function sendApiRequest(path: string, init: RequestInit) {
  const method = init.method ?? "GET";
  const headers = new Headers(init.headers);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (unsafeMethods.has(method.toUpperCase())) {
    headers.set("X-CSRF-Token", await ensureCsrfToken());
  }

  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers,
    method,
  });
}

async function readApiError(response: Response) {
  const errorBody = (await response.json().catch(() => null)) as { message?: string } | null;

  return new ApiError(
    errorBody?.message ?? `Account API вернул HTTP ${String(response.status)}`,
    response.status,
  );
}

async function requestApi<TResponse>(
  path: string,
  init: RequestInit = {},
  retryOnUnauthorized = true,
): Promise<TResponse> {
  const response = await sendApiRequest(path, init);

  if (response.status === 401 && retryOnUnauthorized && !path.startsWith("/auth/")) {
    try {
      await refreshAccessToken();
      return await requestApi<TResponse>(path, init, false);
    } catch {
      throw await readApiError(response);
    }
  }

  if (!response.ok) {
    throw await readApiError(response);
  }

  return (await response.json().catch(() => undefined)) as TResponse;
}

function getButtonLabel(isFavorite: boolean, authRequired: boolean, isLoading: boolean) {
  if (isLoading) {
    return "Проверяем избранное";
  }

  if (authRequired) {
    return "Войти и сохранить";
  }

  return isFavorite ? "В избранном" : "В избранное";
}

export function FavoriteButton({ productId }: Readonly<{ productId: string }>) {
  const [authRequired, setAuthRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadFavoriteState() {
      try {
        const data = await requestApi<FavoritesResponse>("/favorites");

        if (isActive) {
          setIsFavorite(data.items.some((favorite) => favorite.productId === productId));
          setAuthRequired(false);
          setError(null);
        }
      } catch (unknownError) {
        if (!isActive) {
          return;
        }

        if (unknownError instanceof ApiError && unknownError.status === 401) {
          setAuthRequired(true);
          setError(null);
        } else {
          setError("Избранное временно недоступно");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadFavoriteState();

    return () => {
      isActive = false;
    };
  }, [productId]);

  async function toggleFavorite() {
    if (authRequired) {
      window.location.assign("/login");
      return;
    }

    setIsMutating(true);
    setError(null);

    try {
      if (isFavorite) {
        await requestApi<{ ok: boolean }>(`/favorites/${productId}`, {
          method: "DELETE",
        });
      } else {
        await requestApi<unknown>(`/favorites/${productId}`, {
          method: "POST",
        });
      }

      setIsFavorite((current) => !current);
      setAuthRequired(false);
    } catch (unknownError) {
      if (unknownError instanceof ApiError && unknownError.status === 401) {
        setAuthRequired(true);
      } else {
        setError("Не удалось обновить избранное");
      }
    } finally {
      setIsMutating(false);
    }
  }

  const isDisabled = isLoading || isMutating;
  const label = getButtonLabel(isFavorite, authRequired, isLoading);

  return (
    <div className="space-y-2">
      <Button
        aria-pressed={authRequired ? undefined : isFavorite}
        className={isDisabled ? "w-full gap-2" : "w-full cursor-pointer gap-2"}
        disabled={isDisabled}
        onClick={() => {
          void toggleFavorite();
        }}
        type="button"
        variant={isFavorite ? "secondary" : "outline"}
      >
        <Heart className={isFavorite ? "size-4 fill-current" : "size-4"} aria-hidden="true" />
        {isMutating ? "Сохраняем" : label}
      </Button>
      {error ? <p className="text-xs text-[var(--shop-destructive)]">{error}</p> : null}
    </div>
  );
}
