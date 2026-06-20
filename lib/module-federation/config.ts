export const DEFAULT_CART_MANIFEST_URL = "http://localhost:3002/mf-manifest.json";
export const DEFAULT_ACCOUNT_MANIFEST_URL = "http://localhost:3003/mf-manifest.json";

function resolvePublicUrl(value: string | undefined, fallback: string) {
  const trimmedValue = value?.trim();

  return trimmedValue && trimmedValue.length > 0 ? trimmedValue : fallback;
}

export function getCartManifestUrl() {
  return resolvePublicUrl(process.env.NEXT_PUBLIC_CART_MANIFEST_URL, DEFAULT_CART_MANIFEST_URL);
}

export function getAccountManifestUrl() {
  return resolvePublicUrl(
    process.env.NEXT_PUBLIC_ACCOUNT_MANIFEST_URL,
    DEFAULT_ACCOUNT_MANIFEST_URL,
  );
}
