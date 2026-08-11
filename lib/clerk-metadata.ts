"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";

import { api } from "@/convex/_generated/api";

/**
 * Mirrors Convex-owned state into Clerk `publicMetadata` so `proxy.ts` can make
 * routing decisions without a database round-trip.
 *
 * This is a cache, not the source of truth — Convex owns `role` and
 * `onboardingCompletedAt`, and every mutation and page gate re-checks them
 * server-side. If the mirror drifts, the worst case is a redundant redirect.
 */

async function patchMetadata(clerkUserId: string, patch: Record<string, unknown>) {
  const client = await clerkClient();
  const user = await client.users.getUser(clerkUserId);
  await client.users.updateUserMetadata(clerkUserId, {
    publicMetadata: { ...user.publicMetadata, ...patch },
  });
}

/** Called by the caller for themselves after `users.completeOnboarding` succeeds. */
export async function markOnboardingComplete() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");
  await patchMetadata(userId, { onboardingComplete: true });
}

/**
 * Mirrors a role change onto another user. Server actions are public HTTP
 * endpoints, so this re-verifies against Convex that the *caller* is an admin —
 * without that check any signed-in user could set their own metadata role and
 * slip past the middleware fast-path.
 */
export async function mirrorRole(targetClerkId: string, role: string) {
  const { userId, getToken } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const caller = await fetchQuery(
    api.users.getCurrentUser,
    {},
    { token: (await getToken({ template: "convex" })) ?? undefined },
  );

  if (caller?.role !== "admin") throw new Error("Forbidden");

  await patchMetadata(targetClerkId, { role });
}
