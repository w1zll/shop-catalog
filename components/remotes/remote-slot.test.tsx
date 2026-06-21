import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { getCatalogFederationRuntime } from "../../lib/module-federation/runtime";
import { RemoteSlot, resolveRemoteComponent, withTimeout } from "./remote-slot";

vi.mock("../../lib/module-federation/runtime", () => ({
  getCatalogFederationRuntime: vi.fn(),
}));

const mockedGetCatalogFederationRuntime = vi.mocked(getCatalogFederationRuntime);

function mockRuntime(loadRemote: ReturnType<typeof vi.fn>) {
  mockedGetCatalogFederationRuntime.mockReturnValue({
    loadRemote,
  } as unknown as ReturnType<typeof getCatalogFederationRuntime>);
}

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("RemoteSlot", () => {
  it("renders fallback while the remote component is loading", async () => {
    const loadRemote = vi.fn(() => new Promise(() => undefined));
    mockRuntime(loadRemote);

    render(
      <RemoteSlot
        expose="CartIndicator"
        fallback={<span>Loading cart remote</span>}
        remoteName="cart"
      />,
    );

    expect(screen.getByText("Loading cart remote")).toBeInTheDocument();

    await waitFor(() => {
      expect(loadRemote).toHaveBeenCalledWith("cart/CartIndicator", { from: "runtime" });
    });
  });

  it("loads and renders a remote component with props", async () => {
    function RemoteComponent({ label }: Readonly<{ label: string }>) {
      return <strong>Remote: {label}</strong>;
    }

    const loadRemote = vi.fn(() => Promise.resolve({ default: RemoteComponent }));
    mockRuntime(loadRemote);

    render(
      <RemoteSlot<{ label: string }>
        expose="AddToCartButton"
        fallback={<span>Loading</span>}
        props={{ label: "cart" }}
        remoteName="cart"
      />,
    );

    expect(await screen.findByText("Remote: cart")).toBeInTheDocument();
  });

  it("renders custom error fallback and retries remote loading", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    function RemoteComponent() {
      return <strong>Recovered remote</strong>;
    }

    const loadRemote = vi
      .fn()
      .mockRejectedValueOnce(new Error("Remote boom"))
      .mockResolvedValueOnce({ default: RemoteComponent });
    mockRuntime(loadRemote);

    render(
      <RemoteSlot
        errorFallback={(error, retry) => (
          <button type="button" onClick={retry}>
            {error.message}
          </button>
        )}
        expose="AccountBadge"
        fallback={<span>Loading account remote</span>}
        remoteName="account"
      />,
    );

    fireEvent.click(await screen.findByRole("button", { name: "Remote boom" }));

    expect(await screen.findByText("Recovered remote")).toBeInTheDocument();
    expect(loadRemote).toHaveBeenCalledTimes(2);
  });
});

describe("remote slot helpers", () => {
  it("resolves direct and default-exported remote components", () => {
    function DirectRemote() {
      return null;
    }

    function DefaultRemote() {
      return null;
    }

    expect(resolveRemoteComponent(DirectRemote, "cart/CartIndicator")).toBe(DirectRemote);
    expect(resolveRemoteComponent({ default: DefaultRemote }, "cart/CartIndicator")).toBe(
      DefaultRemote,
    );
  });

  it("throws when a remote module does not contain a React component", () => {
    expect(() => resolveRemoteComponent(null, "cart/CartIndicator")).toThrow("cart/CartIndicator");
  });

  it("rejects when remote loading exceeds the timeout", async () => {
    vi.useFakeTimers();

    const result = expect(
      withTimeout(new Promise(() => undefined), 25, "cart/CartIndicator"),
    ).rejects.toThrow("cart/CartIndicator");
    await vi.advanceTimersByTimeAsync(25);

    await result;
  });
});
