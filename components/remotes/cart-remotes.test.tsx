import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AddToCartButtonRemote, CartIndicatorRemote } from "./cart-remotes";

const remoteSlotMock = vi.hoisted(() => vi.fn());

vi.mock("./remote-slot", () => ({
  RemoteSlot: remoteSlotMock,
}));

type RemoteSlotMockProps = {
  errorFallback?: (error: Error, retry: () => void) => ReactNode;
  expose: string;
  fallback: ReactNode;
  props?: Record<string, unknown>;
  remoteName: string;
};

function getLastRemoteSlotProps() {
  const props = remoteSlotMock.mock.calls.at(-1)?.[0] as RemoteSlotMockProps | undefined;

  if (!props) {
    throw new Error("RemoteSlot was not rendered");
  }

  return props;
}

describe("cart remotes", () => {
  beforeEach(() => {
    remoteSlotMock.mockReset();
    remoteSlotMock.mockImplementation(({ fallback }: RemoteSlotMockProps) => fallback);
  });

  it("loads the cart indicator expose and renders its compact fallback", () => {
    render(<CartIndicatorRemote />);

    expect(getLastRemoteSlotProps()).toMatchObject({
      expose: "CartIndicator",
      remoteName: "cart",
    });
    expect(screen.getByRole("link", { name: "Корзина" })).toHaveAttribute("href", "/cart");
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("loads the add-to-cart expose with product props and fallback state", () => {
    render(
      <AddToCartButtonRemote
        className="product-action"
        disabled
        maxQuantity={0}
        productId="product-1"
      />,
    );

    expect(getLastRemoteSlotProps()).toMatchObject({
      expose: "AddToCartButton",
      props: {
        className: "product-action",
        disabled: true,
        maxQuantity: 0,
        productId: "product-1",
      },
      remoteName: "cart",
    });
    expect(screen.getByRole("button", { name: "Добавить в корзину" })).toBeDisabled();
  });

  it("renders a disabled compact fallback when the add-to-cart remote fails", () => {
    remoteSlotMock.mockImplementation(({ errorFallback, fallback }: RemoteSlotMockProps) =>
      errorFallback ? errorFallback(new Error("cart remote failed"), vi.fn()) : fallback,
    );

    render(<AddToCartButtonRemote className="product-action" productId="product-1" />);

    expect(screen.getByRole("button", { name: "Корзина временно недоступна" })).toBeDisabled();
    expect(screen.getByTitle(/cart remote/)).toBeInTheDocument();
    expect(getLastRemoteSlotProps()).toMatchObject({
      expose: "AddToCartButton",
      remoteName: "cart",
    });
  });
});
