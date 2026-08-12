import { cache } from "react";
import { auth } from "@clerk/nextjs/server";

import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { fetchQuery } from "@/lib/convex-server";

export type DashboardUser = Doc<"users">;

export type DashboardSession = {
  /**
   * Null when the Clerk `convex` JWT template is missing. That is "couldn't
   * ask", not "not allowed" — callers must render an explanation rather than
   * redirecting, or a real admin sees an unexplained bounce.
   */
  token: string | null;
  /** Null when there is no token, or the Clerk webhook hasn't synced the row yet. */
  user: DashboardUser | null;
};

/**
 * Mints a Clerk `convex` JWT and fetches the caller's Convex user row.
 *
 * Wrapped in React's request-scoped `cache` so the layout and every page it
 * renders share a single call — without this, each of the JWT mint and the
 * Convex round trip happens twice per navigation (layout + page), and neither
 * is a GET that Next's fetch dedup would collapse on its own.
 */
export const getDashboardSession = cache(async (): Promise<DashboardSession> => {
  const { getToken } = await auth();
  const token = await getToken({ template: "convex" });
  if (!token) return { token: null, user: null };

  const user = await fetchQuery(api.users.getCurrentUser, {}, { token });
  return { token, user: user ?? null };
});

export function isAdmin(user: DashboardUser | null): boolean {
  return user?.role === "admin";
}

export function isStaff(user: DashboardUser | null): boolean {
  return user?.role === "admin" || user?.role === "content_manager";
}

/**
 * Result of a page-level staff/admin gate.
 *
 * `status: "syncing"` is the state the old (admin) layout handled and the
 * merge briefly dropped: a valid Clerk token but no Convex row yet (fresh
 * sign-up, webhook lag, transient Convex failure). It must render an
 * explanation, not look like a denial — `isStaff(null)`/`isAdmin(null)` are
 * both false, so without this distinction a real content manager's CMS
 * silently vanishes with no explanation. `"denied"` covers both no-token
 * (couldn't verify) and a genuinely insufficient role — either way the page
 * redirects away, unchanged from prior behaviour.
 */
export type GateResult =
  | { status: "ok"; user: DashboardUser; token: string }
  | { status: "syncing" }
  | { status: "denied" };

async function gate(check: (user: DashboardUser | null) => boolean): Promise<GateResult> {
  const { token, user } = await getDashboardSession();
  if (!token) return { status: "denied" };
  if (!user) return { status: "syncing" };
  if (!check(user)) return { status: "denied" };
  return { status: "ok", user, token };
}

/** Page-level gate for staff-only routes (content managers and admins). */
export async function gateStaff(): Promise<GateResult> {
  return gate(isStaff);
}

/** Page-level gate for admin-only routes. */
export async function gateAdmin(): Promise<GateResult> {
  return gate(isAdmin);
}
