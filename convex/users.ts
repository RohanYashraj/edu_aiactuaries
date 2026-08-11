import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  actuarialBodyValidator,
  experienceLevelValidator,
  roleValidator,
} from "./schema";
import { getCurrentUser as resolveCurrentUser, requireAdmin, requireUser } from "./lib/auth";

/** How long between `lastSeenAt` writes. Keeps syncCurrentUser from writing on every page load. */
const SEEN_DEBOUNCE_MS = 60_000;

/**
 * The Clerk webhook route calls Convex over HTTP with no user identity, so
 * these two mutations cannot use `requireUser`. Without a shared secret they
 * are unauthenticated writes to the users table — `deleteByClerkId` in
 * particular would let anyone who guesses a Clerk id delete that account's
 * record. Fails closed if the secret is unset on either side.
 */
function assertWebhookSecret(provided: string | undefined) {
  const expected = process.env.CONVEX_WEBHOOK_SECRET;
  if (!expected) {
    throw new Error(
      "CONVEX_WEBHOOK_SECRET is not set on the Convex deployment; refusing the write",
    );
  }
  if (provided !== expected) throw new Error("Invalid webhook secret");
}

export const upsertFromClerk = mutation({
  args: {
    secret: v.string(),
    clerkId: v.string(),
    email: v.string(),
    username: v.optional(v.string()),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    /** Only honoured when creating the user. See the note below. */
    role: v.optional(roleValidator),
  },
  handler: async (ctx, args) => {
    assertWebhookSecret(args.secret);

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existing) {
      // Deliberately does NOT patch `role`. Convex is the source of truth for
      // roles; previously every `user.updated` webhook (a name change, an
      // avatar upload) reset the role to public_metadata.role ?? "member",
      // which would silently demote admins and content managers.
      await ctx.db.patch(existing._id, {
        email: args.email,
        username: args.username,
        name: args.name,
        imageUrl: args.imageUrl,
      });
      return existing._id;
    }

    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      username: args.username,
      name: args.name,
      imageUrl: args.imageUrl,
      role: args.role ?? "member",
      approvedAt: Date.now(),
    });
  },
});

export const deleteByClerkId = mutation({
  args: { secret: v.string(), clerkId: v.string() },
  handler: async (ctx, args) => {
    assertWebhookSecret(args.secret);

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (user) await ctx.db.delete(user._id);
    return null;
  },
});

export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => resolveCurrentUser(ctx),
});

/**
 * Client-side sync fallback: reads identity from the verified JWT, so it works
 * in local dev without a webhook tunnel. The webhook remains primary in prod.
 * Never touches `role` — same reasoning as upsertFromClerk.
 */
export const syncCurrentUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const clerkId = identity.subject;
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .unique();

    const profile = {
      email: identity.email ?? "",
      username: identity.nickname ?? undefined,
      name: identity.name ?? "User",
      imageUrl: identity.pictureUrl ?? undefined,
    };

    if (existing) {
      // This mutation fires on every signed-in page load. Skip the write when
      // nothing changed and we synced recently.
      const seenRecently =
        existing.lastSeenAt !== undefined &&
        Date.now() - existing.lastSeenAt < SEEN_DEBOUNCE_MS;
      const unchanged =
        existing.email === profile.email &&
        existing.username === profile.username &&
        existing.name === profile.name &&
        existing.imageUrl === profile.imageUrl;

      if (seenRecently && unchanged) return existing._id;

      await ctx.db.patch(existing._id, { ...profile, lastSeenAt: Date.now() });
      return existing._id;
    }

    return await ctx.db.insert("users", {
      clerkId,
      ...profile,
      role: "member",
      approvedAt: Date.now(),
      lastSeenAt: Date.now(),
    });
  },
});

/* -------------------------------------------------------------------------- */
/*  Membership profile                                                        */
/* -------------------------------------------------------------------------- */

const profileFields = {
  headline: v.optional(v.string()),
  institution: v.optional(v.string()),
  actuarialBody: v.optional(actuarialBodyValidator),
  actuarialBodyOther: v.optional(v.string()),
  examsCleared: v.optional(v.array(v.string())),
  examsClearedCount: v.optional(v.number()),
  interests: v.optional(v.array(v.string())),
  experienceLevel: v.optional(experienceLevelValidator),
  country: v.optional(v.string()),
  linkedinUrl: v.optional(v.string()),
};

/** Completes the post-signup profile step and unlocks the dashboard. */
export const completeOnboarding = mutation({
  args: profileFields,
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    await ctx.db.patch(user._id, {
      ...args,
      examsClearedCount: args.examsCleared?.length ?? args.examsClearedCount,
      onboardingCompletedAt: user.onboardingCompletedAt ?? Date.now(),
    });
    return user._id;
  },
});

/** Edits the profile later, from /dashboard/profile. */
export const updateProfile = mutation({
  args: { name: v.optional(v.string()), ...profileFields },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    await ctx.db.patch(user._id, {
      ...args,
      examsClearedCount: args.examsCleared?.length ?? args.examsClearedCount,
    });
    return user._id;
  },
});

/* -------------------------------------------------------------------------- */
/*  Admin user management                                                     */
/* -------------------------------------------------------------------------- */

export const adminList = query({
  args: {
    role: v.optional(roleValidator),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const limit = args.limit ?? 200;

    if (args.role) {
      return await ctx.db
        .query("users")
        .withIndex("by_role", (q) => q.eq("role", args.role!))
        .order("desc")
        .take(limit);
    }
    return await ctx.db.query("users").order("desc").take(limit);
  },
});

export const adminSetRole = mutation({
  args: { userId: v.id("users"), role: roleValidator },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx);

    if (actor._id === args.userId && args.role !== "admin") {
      throw new Error("You cannot remove your own admin role");
    }

    const target = await ctx.db.get(args.userId);
    if (!target) throw new Error("User not found");

    // Never allow the last admin to be demoted — that locks everyone out of
    // /admin with no in-app way back.
    if (target.role === "admin" && args.role !== "admin") {
      const admins = await ctx.db
        .query("users")
        .withIndex("by_role", (q) => q.eq("role", "admin"))
        .collect();
      if (admins.length <= 1) {
        throw new Error("Cannot demote the last remaining admin");
      }
    }

    await ctx.db.patch(args.userId, {
      role: args.role,
      roleUpdatedAt: Date.now(),
      roleUpdatedBy: actor._id,
    });

    // Returned so the caller can mirror the new role into Clerk publicMetadata
    // for the middleware fast-path.
    return { clerkId: target.clerkId, role: args.role };
  },
});

export const adminStats = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const users = await ctx.db.query("users").collect();
    return {
      total: users.length,
      onboarded: users.filter((u) => u.onboardingCompletedAt !== undefined).length,
      byRole: {
        member: users.filter((u) => u.role === "member").length,
        content_manager: users.filter((u) => u.role === "content_manager").length,
        admin: users.filter((u) => u.role === "admin").length,
      },
    };
  },
});
