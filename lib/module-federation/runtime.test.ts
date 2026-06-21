import * as React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

type RuntimeInstance = {
  loadRemote: ReturnType<typeof vi.fn>;
  name: string;
};

type SharedDependency = {
  lib: () => unknown;
  shareConfig: {
    requiredVersion: string;
    singleton: boolean;
  };
  version: string;
};

type RuntimeOptions = {
  name: string;
  remotes: Array<{
    entry: string;
    name: string;
  }>;
  shared: {
    react: SharedDependency;
    "react-dom": SharedDependency;
  };
};

async function loadRuntimeWithMocks(existingRuntime?: RuntimeInstance) {
  const createInstanceMock = vi.fn(
    (options: RuntimeOptions): RuntimeInstance => ({
      loadRemote: vi.fn(),
      name: options.name,
    }),
  );
  const getInstanceMock = vi.fn((predicate: (instance: RuntimeInstance) => boolean) =>
    existingRuntime && predicate(existingRuntime) ? existingRuntime : undefined,
  );

  vi.doMock("@module-federation/runtime", () => ({
    createInstance: createInstanceMock,
    getInstance: getInstanceMock,
  }));
  vi.doMock("./config", () => ({
    getAccountManifestUrl: vi.fn(() => "http://account.test/mf-manifest.json"),
    getCartManifestUrl: vi.fn(() => "http://cart.test/mf-manifest.json"),
  }));

  const runtimeModule = await import("./runtime");

  return {
    createInstanceMock,
    getCatalogFederationRuntime: runtimeModule.getCatalogFederationRuntime,
    getInstanceMock,
  };
}

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe("getCatalogFederationRuntime", () => {
  it("creates catalog runtime with cart/account remotes and React singletons", async () => {
    const { createInstanceMock, getCatalogFederationRuntime } = await loadRuntimeWithMocks();

    const runtime = getCatalogFederationRuntime();
    const options = createInstanceMock.mock.calls[0]?.[0] as RuntimeOptions | undefined;

    expect(runtime.name).toBe("shop_catalog");
    expect(options).toMatchObject({
      name: "shop_catalog",
      remotes: [
        {
          entry: "http://cart.test/mf-manifest.json",
          name: "cart",
        },
        {
          entry: "http://account.test/mf-manifest.json",
          name: "account",
        },
      ],
    });
    expect(options?.shared.react).toMatchObject({
      shareConfig: {
        requiredVersion: React.version,
        singleton: true,
      },
      version: React.version,
    });
    expect((options?.shared.react.lib() as typeof React).version).toBe(React.version);
    expect(options?.shared["react-dom"]).toMatchObject({
      shareConfig: {
        requiredVersion: React.version,
        singleton: true,
      },
      version: React.version,
    });
    expect(typeof options?.shared["react-dom"].lib()).toBe("object");
  });

  it("reuses an existing catalog runtime instance", async () => {
    const existingRuntime: RuntimeInstance = {
      loadRemote: vi.fn(),
      name: "shop_catalog",
    };
    const { createInstanceMock, getCatalogFederationRuntime, getInstanceMock } =
      await loadRuntimeWithMocks(existingRuntime);

    expect(getCatalogFederationRuntime()).toBe(existingRuntime);
    expect(getInstanceMock).toHaveBeenCalledTimes(1);
    expect(createInstanceMock).not.toHaveBeenCalled();
  });
});
