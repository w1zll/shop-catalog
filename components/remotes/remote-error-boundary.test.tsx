import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { RemoteErrorBoundary } from "./remote-error-boundary";

function ThrowingRemote({ message }: Readonly<{ message: string }>) {
  throw new Error(message);

  return null;
}

function StableRemote() {
  return <span>Remote content</span>;
}

describe("RemoteErrorBoundary", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders fallback, reports the error and calls retry", async () => {
    const onError = vi.fn();
    const onRetry = vi.fn();

    render(
      <RemoteErrorBoundary
        fallback={(error, retry) => (
          <button type="button" onClick={retry}>
            {error.message}
          </button>
        )}
        onError={onError}
        onRetry={onRetry}
        resetKey={0}
      >
        <ThrowingRemote message="Remote failed" />
      </RemoteErrorBoundary>,
    );

    fireEvent.click(await screen.findByRole("button", { name: "Remote failed" }));

    expect(onError).toHaveBeenCalledWith(expect.any(Error), expect.any(Object));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("clears captured errors when resetKey changes", async () => {
    const { rerender } = render(
      <RemoteErrorBoundary
        fallback={(error) => <span>{error.message}</span>}
        onRetry={vi.fn()}
        resetKey={0}
      >
        <ThrowingRemote message="Remote failed" />
      </RemoteErrorBoundary>,
    );

    expect(await screen.findByText("Remote failed")).toBeInTheDocument();

    rerender(
      <RemoteErrorBoundary
        fallback={(error) => <span>{error.message}</span>}
        onRetry={vi.fn()}
        resetKey={1}
      >
        <StableRemote />
      </RemoteErrorBoundary>,
    );

    expect(await screen.findByText("Remote content")).toBeInTheDocument();
  });
});
