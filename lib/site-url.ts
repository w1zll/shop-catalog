const DEFAULT_PUBLIC_SITE_URL = "http://localhost:3000";

export function getPublicSiteUrl(siteUrl = process.env.NEXT_PUBLIC_SITE_URL): string {
  const rawSiteUrl = siteUrl?.trim() || DEFAULT_PUBLIC_SITE_URL;

  try {
    const parsedSiteUrl = new URL(rawSiteUrl);

    if (!["http:", "https:"].includes(parsedSiteUrl.protocol) || parsedSiteUrl.origin === "null") {
      return DEFAULT_PUBLIC_SITE_URL;
    }

    return parsedSiteUrl.origin;
  } catch {
    return DEFAULT_PUBLIC_SITE_URL;
  }
}
