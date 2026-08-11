import { ImageResponse } from "next/og";

import { siteName } from "@/lib/site";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * Shared social card.
 *
 * The palette is hardcoded rather than read from globals.css because Satori
 * resolves no CSS variables — these are the same oklch tokens converted to hex.
 */
const INDIGO = "#1b2a5e";
const GOLD = "#e0983a";
const CREAM = "#faf8f4";

/**
 * Renders the card for one page.
 *
 * Deliberately type-only, not per-document art: the title carries the meaning,
 * and a template that always works beats one that breaks on a long heading.
 */
export function renderOgImage({
  title,
  eyebrow,
  meta,
}: {
  title: string;
  eyebrow?: string;
  meta?: string;
}) {
  // Long titles get a smaller face rather than overflowing the card.
  const titleSize = title.length > 70 ? 56 : title.length > 40 ? 68 : 82;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: CREAM,
          padding: 72,
          // Satori has no default font stack; these ship with the renderer.
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {eyebrow ? (
            <div
              style={{
                fontSize: 24,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: GOLD,
                fontFamily: "monospace",
                marginBottom: 28,
              }}
            >
              {eyebrow}
            </div>
          ) : null}

          <div
            style={{
              fontSize: titleSize,
              lineHeight: 1.1,
              color: INDIGO,
              letterSpacing: -1,
              // Satori needs an explicit wrap width.
              maxWidth: 1000,
            }}
          >
            {title}
          </div>

          {meta ? (
            <div
              style={{
                marginTop: 28,
                fontSize: 28,
                color: "#5b6480",
                fontFamily: "monospace",
              }}
            >
              {meta}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `2px solid ${GOLD}`,
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 52,
                height: 52,
                borderRadius: 12,
                background: GOLD,
                color: INDIGO,
                fontSize: 22,
                fontWeight: 700,
                fontFamily: "sans-serif",
              }}
            >
              edu.
            </div>
            <div style={{ fontSize: 28, color: INDIGO }}>{siteName}</div>
          </div>
          <div style={{ fontSize: 22, color: "#5b6480", fontFamily: "monospace" }}>
            sssia.org
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
