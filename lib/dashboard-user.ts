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

export async function getDashboardSession(): Promise<DashboardSession> {
  const { getToken } = await auth();
  const token = await getToken({ template: "convex" });
  if (!token) return { token: null, user: null };

  const user = await fetchQuery(api.users.getCurrentUser, {}, { token });
  return { token, user: user ?? null };
}

export function isAdmin(user: DashboardUser | null): boolean {
  return user?.role === "admin";
}

export function isStaff(user: DashboardUser | null): boolean {
  return user?.role === "admin" || user?.role === "content_manager";
}
