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
  return <RemoteSlot expose="CartIndicator" fallback={<CartIndicatorFallback />} remoteName="cart" />;
}

function AddToCartButtonFallback({ disabled }: Readonly<{ disabled?: boolean }>) {
  return (
    <Button className="w-full" disabled={disabled} type="button">
      Добавить в корзину
    </Button>
  );
}

export function AddToCartButtonRemote(props: AddToCartButtonRemoteProps) {
  return (
    <RemoteSlot
      expose="AddToCartButton"
      fallback={<AddToCartButtonFallback disabled={props.disabled} />}
      props={props}
      remoteName="cart"
    />
  );
}
