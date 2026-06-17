export const DEFAULT_CART_MANIFEST_URL = "http://localhost:3002/mf-manifest.json";

export function getCartManifestUrl() {
  const value = process.env.NEXT_PUBLIC_CART_MANIFEST_URL?.trim();

  return value && value.length > 0 ? value : DEFAULT_CART_MANIFEST_URL;
}
