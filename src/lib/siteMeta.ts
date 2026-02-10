/**
 * Default site meta for SEO and social sharing.
 * Override VITE_SITE_URL in production for correct og:image and canonical URLs.
 */
export const SITE_NAME = "SoloSuccess Academy";
export const DEFAULT_TITLE = `${SITE_NAME} - AI-Powered Learning for Solo Founders`;
export const DEFAULT_DESCRIPTION =
  "Master entrepreneurship with 10 AI-powered courses designed for solo founders. From mindset to pitch, build your business one course at a time.";
export const TWITTER_HANDLE = "@SoloSuccessAcad";

/** Absolute base URL for the site (for og:image, canonical). Set VITE_SITE_URL in production. */
export function getSiteUrl(): string {
  if (typeof window !== "undefined") return window.location.origin;
  return import.meta.env.VITE_SITE_URL ?? "";
}

/** Full URL for the default share image. Add public/og-image.png (1200×630) for best results. */
export function getOgImageUrl(path = "/og-image.png"): string {
  const base = getSiteUrl();
  if (!base) return path.startsWith("/") ? path : `/${path}`;
  return path.startsWith("http") ? path : `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
