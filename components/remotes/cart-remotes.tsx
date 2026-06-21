"use client";

import { ShoppingCart } from "lucide-react";
import { Badge, Button } from "@w1zll/shop-ui";

import { RemoteSlot } from "./remote-slot";

type AddToCartButtonRemoteProps = {
  className?: string;
  disabled?: boolean;
  maxQuantity?: number;
  productId: string;
};

export function CartIndicatorFallback() {
  return (
    <Button asChild className="relative size-10 p-0" variant="outline">
      <a href="/cart" aria-label="Корзина">
        <ShoppingCart className="size-4" aria-hidden="true" />
        <Badge className="absolute -right-2 -top-2 px-1.5 py-0 text-[10px]">0</Badge>
      </a>
    </Button>
  );
}

export function CartIndicatorRemote() {
  return (
    <RemoteSlot
      errorFallback={() => <CartIndicatorFallback />}
      expose="CartIndicator"
      fallback={<CartIndicatorFallback />}
      remoteName="cart"
    />
  );
}

function AddToCartButtonFallback({
  className = "w-full",
  disabled,
}: Readonly<{ className?: string; disabled?: boolean }>) {
  return (
    <Button className={className} disabled={disabled} type="button">
      Добавить в корзину
    </Button>
  );
}

function UnavailableAddToCartButton({ className = "w-full" }: Readonly<{ className?: string }>) {
  return (
    <span className="block" title="Корзина временно недоступна: cart remote не загрузился">
      <Button
        aria-label="Корзина временно недоступна"
        className={`${className} gap-2 border-red-500/70 text-red-600 opacity-100`}
        disabled
        type="button"
        variant="outline"
      >
        <ShoppingCart className="size-4" aria-hidden="true" />
        Корзина недоступна
      </Button>
    </span>
  );
}

export function AddToCartButtonRemote(props: AddToCartButtonRemoteProps) {
  return (
    <RemoteSlot
      errorFallback={() => <UnavailableAddToCartButton className={props.className} />}
      expose="AddToCartButton"
      fallback={<AddToCartButtonFallback className={props.className} disabled={props.disabled} />}
      props={props}
      remoteName="cart"
    />
  );
}
