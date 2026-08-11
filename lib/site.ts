/**
 * Single source of truth for site-wide constants used by metadata, JSON-LD,
 * sitemap, robots and llms.txt. Everything that used to be copy-pasted into
 * each page's `metadata` block reads from here instead.
 */

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sssia.org"
).replace(/\/$/, "");

export const siteName = "Sri Sathya Sai Institute of Actuaries";

export const siteShortName = "SSSIA";

export const siteBrandTitle = `${siteName} - Powered by aiactuaries.org`;

export const siteTagline = "for Actuarial Data Science & AI";

export const siteDescription =
  "Pioneering the future of Actuarial Science through AI and Data Science. Professional certifications, workshops, and events for members across India.";

/** Default social card. Replaced per-page by generated OG images where available. */
export const defaultOgImage = "/sssia.png";

export const socialLinks = [
  "https://aiactuaries.org",
] as const;

/** Absolute URL helper — accepts a path or an already-absolute URL. */
export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
