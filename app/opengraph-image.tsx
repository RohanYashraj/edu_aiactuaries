import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image";
import { siteTagline } from "@/lib/site";

export const alt = "Sri Sathya Sai Institute of Actuaries";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgImage({
    eyebrow: "Powered by aiactuaries.org",
    title: "Sri Sathya Sai Institute of Actuaries",
    meta: siteTagline,
  });
}
