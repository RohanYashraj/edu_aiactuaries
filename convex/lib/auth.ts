import type { Doc } from "../_generated/dataModel";
import type { QueryCtx, MutationCtx } from "../_generated/server";

export type Role = Doc<"users">["role"];

export const CONTENT_ROLES: Role[] = ["content_manager", "admin"];

type Ctx = QueryCtx | MutationCtx;

/**
 * Resolves the signed-in user from the verified Clerk JWT.
 * Returns null when unauthenticated or not yet synced into Convex.
 */
export async function getCurrentUser(ctx: Ctx): Promise<Doc<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  return await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
    .unique();
}

/** Throws unless a synced, authenticated user exists. */
export async function requireUser(ctx: Ctx): Promise<Doc<"users">> {
  const user = await getCurrentUser(ctx);
  if (!user) throw new Error("Not authenticated");
  return user;
}

/**
 * Server-side authorization gate. This is the real enforcement point — the
 * middleware role check is only a redirect hint and can be stale.
 */
export async function requireRole(
  ctx: Ctx,
  roles: readonly Role[],
): Promise<Doc<"users">> {
  const user = await requireUser(ctx);
  if (!roles.includes(user.role)) {
    throw new Error(
      `Forbidden: requires one of [${roles.join(", ")}], have "${user.role}"`,
    );
  }
  return user;
}

/** Content managers and admins may edit content. */
export function requireContentManager(ctx: Ctx) {
  return requireRole(ctx, CONTENT_ROLES);
}

/** Only admins may manage users and roles. */
export function requireAdmin(ctx: Ctx) {
  return requireRole(ctx, ["admin"]);
}
