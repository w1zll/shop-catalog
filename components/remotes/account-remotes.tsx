"use client";

import { Heart, UserRound } from "lucide-react";
import { Button } from "@w1zll/shop-ui";

import { RemoteSlot } from "./remote-slot";

export function AccountBadgeFallback() {
  return (
    <div className="catalog-sm-up">
      <AccountBadgeButton />
    </div>
  );
}

function AccountBadgeButton() {
  return (
    <Button asChild className="gap-2" variant="outline">
      <a href="/account">
        <UserRound className="size-4" aria-hidden="true" />
        Войти
      </a>
    </Button>
  );
}

export function AccountBadgeRemote() {
  return (
    <RemoteSlot
      errorFallback={() => (
        <UnavailableAccountControl
          label="Аккаунт временно недоступен"
          title="Аккаунт временно недоступен: account remote не загрузился"
        />
      )}
      expose="AccountBadge"
      fallback={<AccountBadgeFallback />}
      remoteName="account"
    />
  );
}

export function AccountMenuFallback() {
  return (
    <div className="catalog-sm-up">
      <AccountMenuButton />
    </div>
  );
}

function AccountMenuButton() {
  return (
    <Button asChild aria-label="Избранное" className="size-10 p-0" variant="ghost">
      <a href="/account/favorites">
        <Heart className="size-4" aria-hidden="true" />
      </a>
    </Button>
  );
}

export function AccountMenuRemote() {
  return (
    <RemoteSlot
      errorFallback={() => (
        <UnavailableAccountControl
          iconOnly
          label="Избранное временно недоступно"
          title="Избранное временно недоступно: account remote не загрузился"
        />
      )}
      expose="AccountMenu"
      fallback={<AccountMenuFallback />}
      remoteName="account"
    />
  );
}

function UnavailableAccountControl({
  iconOnly = false,
  label,
  title,
}: Readonly<{ iconOnly?: boolean; label: string; title: string }>) {
  return (
    <span className="catalog-sm-up" title={title}>
      <Button
        aria-label={label}
        className={
          iconOnly
            ? "size-10 border border-red-500/70 p-0 text-red-600 opacity-100"
            : "gap-2 border-red-500/70 text-red-600 opacity-100"
        }
        disabled
        type="button"
        variant={iconOnly ? "ghost" : "outline"}
      >
        {iconOnly ? (
          <Heart className="size-4" aria-hidden="true" />
        ) : (
          <>
            <UserRound className="size-4" aria-hidden="true" />
            Аккаунт
          </>
        )}
      </Button>
    </span>
  );
}
