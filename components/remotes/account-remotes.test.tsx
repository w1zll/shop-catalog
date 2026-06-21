import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AccountBadgeRemote, AccountMenuRemote } from "./account-remotes";

const remoteSlotMock = vi.hoisted(() => vi.fn());

vi.mock("./remote-slot", () => ({
  RemoteSlot: remoteSlotMock,
}));

type RemoteSlotMockProps = {
  errorFallback?: (error: Error, retry: () => void) => ReactNode;
  expose: string;
  fallback: ReactNode;
  remoteName: string;
};

function getRemoteSlotCalls() {
  return remoteSlotMock.mock.calls.map((call) => call[0] as RemoteSlotMockProps);
}

describe("account remotes", () => {
  beforeEach(() => {
    remoteSlotMock.mockReset();
    remoteSlotMock.mockImplementation(({ errorFallback, fallback }: RemoteSlotMockProps) =>
      errorFallback ? errorFallback(new Error("account remote failed"), vi.fn()) : fallback,
    );
  });

  it("loads account badge and menu exposes", () => {
    render(
      <>
        <AccountBadgeRemote />
        <AccountMenuRemote />
      </>,
    );

    expect(getRemoteSlotCalls()).toEqual([
      expect.objectContaining({
        expose: "AccountBadge",
        remoteName: "account",
      }),
      expect.objectContaining({
        expose: "AccountMenu",
        remoteName: "account",
      }),
    ]);
  });

  it("renders disabled account badge when the account remote fails", () => {
    render(<AccountBadgeRemote />);

    expect(screen.getByRole("button", { name: "Аккаунт временно недоступен" })).toBeDisabled();
    expect(screen.getByTitle(/account remote/)).toBeInTheDocument();
  });

  it("renders disabled favorites control when the account menu remote fails", () => {
    render(<AccountMenuRemote />);

    expect(screen.getByRole("button", { name: "Избранное временно недоступно" })).toBeDisabled();
    expect(screen.getByTitle(/account remote/)).toBeInTheDocument();
  });
});
