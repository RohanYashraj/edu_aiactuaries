import { NextResponse } from "next/server";

const KEY = "visitors:total";
// Visitors counted before this counter existed; added to the stored total.
const BASE_COUNT = 18000;

const noStore = { headers: { "Cache-Control": "no-store" } };
const unavailable = () => NextResponse.json({ error: "unavailable" }, { status: 503 });

/**
 * Upstash Redis over its REST API (the Vercel Marketplace integration sets
 * KV_REST_API_URL / KV_REST_API_TOKEN). Plain fetch keeps this dependency-free,
 * so the pnpm lockfile does not need to change.
 */
async function redis(command: "get" | "incr"): Promise<number | null> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;

  const res = await fetch(`${url}/${command}/${encodeURIComponent(KEY)}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return null;

  const { result } = (await res.json()) as { result: number | string | null };
  return Number(result ?? 0);
}

// Local `next dev` never touches the real database, so previewing the footer
// cannot change the live count. Not reachable in a production build.
const devPreview = process.env.NODE_ENV === "development";

async function respond(command: "get" | "incr") {
  if (devPreview) return NextResponse.json({ count: BASE_COUNT }, noStore);
  try {
    const stored = await redis(command);
    if (stored === null) return unavailable();
    return NextResponse.json({ count: stored + BASE_COUNT }, noStore);
  } catch {
    return unavailable();
  }
}

// Read the current total.
export const GET = () => respond("get");

// Count one new visitor and return the new total.
export const POST = () => respond("incr");
