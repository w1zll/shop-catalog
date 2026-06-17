"use client";

import { createInstance, getInstance, type ModuleFederation } from "@module-federation/runtime";
import * as React from "react";
import * as ReactDom from "react-dom";

import { getCartManifestUrl } from "./config";

const CATALOG_RUNTIME_NAME = "shop_catalog";

let runtime: ModuleFederation | null = null;

export function getCatalogFederationRuntime() {
  if (runtime) {
    return runtime;
  }

  const existingRuntime = getInstance((instance) => instance.name === CATALOG_RUNTIME_NAME);

  if (existingRuntime) {
    runtime = existingRuntime;
    return runtime;
  }

  runtime = createInstance({
    name: CATALOG_RUNTIME_NAME,
    remotes: [
      {
        name: "cart",
        entry: getCartManifestUrl(),
      },
    ],
    shared: {
      react: {
        version: React.version,
        lib: () => React,
        shareConfig: {
          singleton: true,
          requiredVersion: React.version,
        },
      },
      "react-dom": {
        version: React.version,
        lib: () => ReactDom,
        shareConfig: {
          singleton: true,
          requiredVersion: React.version,
        },
      },
    },
  });

  return runtime;
}
