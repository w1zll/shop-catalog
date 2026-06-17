"use client";

import type { ComponentType, ReactNode } from "react";
import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { Button, RemoteErrorFallback } from "@w1zll/shop-ui";

import { getCatalogFederationRuntime } from "../../lib/module-federation/runtime";
import { RemoteErrorBoundary } from "./remote-error-boundary";

type RemoteSlotProps<TProps extends Record<string, unknown>> = {
  expose: string;
  fallback: ReactNode;
  props?: TProps;
  remoteName: string;
  timeoutMs?: number;
};

type RemoteModule<TProps extends Record<string, unknown>> =
  | ComponentType<TProps>
  | {
      default?: ComponentType<TProps>;
    };

const DEFAULT_TIMEOUT_MS = 8_000;

function withTimeout<TResult>(promise: Promise<TResult>, timeoutMs: number, label: string) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`${label} не загрузился за ${String(timeoutMs)} мс`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  });
}

function resolveRemoteComponent<TProps extends Record<string, unknown>>(
  remoteModule: RemoteModule<TProps> | null,
  label: string,
) {
  if (typeof remoteModule === "function") {
    return remoteModule;
  }

  if (remoteModule?.default) {
    return remoteModule.default;
  }

  throw new Error(`${label} вернул модуль без React-компонента`);
}

export function RemoteSlot<TProps extends Record<string, unknown> = Record<string, never>>({
  expose,
  fallback,
  props,
  remoteName,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}: RemoteSlotProps<TProps>) {
  const [isMounted, setIsMounted] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const label = `${remoteName}/${expose}`;

  const LazyRemote = useMemo(
    () =>
      lazy(async () => {
        const runtime = getCatalogFederationRuntime();
        const remoteModule = await withTimeout(
          runtime.loadRemote<RemoteModule<TProps>>(`${remoteName}/${expose}`, {
            from: "runtime",
          }),
          timeoutMs,
          label,
        );

        return {
          default: resolveRemoteComponent(remoteModule, label),
        };
      }),
    [expose, label, remoteName, retryKey, timeoutMs],
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  function retry() {
    setRetryKey((currentKey) => currentKey + 1);
  }

  if (!isMounted) {
    return fallback;
  }

  return (
    <RemoteErrorBoundary
      fallback={(error, retryRemote) => (
        <RemoteErrorFallback remoteName={label} onRetry={retryRemote}>
          <div className="space-y-3">
            <p className="text-sm font-medium text-[var(--shop-foreground)]">
              Не удалось загрузить cart remote.
            </p>
            <p className="text-xs text-[var(--shop-muted-foreground)]">{error.message}</p>
            <Button size="sm" type="button" variant="outline" onClick={retryRemote}>
              Повторить
            </Button>
          </div>
        </RemoteErrorFallback>
      )}
      onError={(error, info) => {
        console.error("[shop-catalog] Ошибка загрузки remote", {
          error,
          expose,
          info,
          remoteName,
        });
      }}
      onRetry={retry}
      resetKey={retryKey}
    >
      <Suspense fallback={fallback}>
        <LazyRemote {...(props ?? ({} as TProps))} />
      </Suspense>
    </RemoteErrorBoundary>
  );
}
