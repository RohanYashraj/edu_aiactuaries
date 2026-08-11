import type { Id } from "../_generated/dataModel";
import type { QueryCtx, MutationCtx } from "../_generated/server";

/** URL-safe slug from a title. Deterministic, so seeds stay idempotent. */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip combining diacritics
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

/**
 * Returns `desired` if free, otherwise appends -2, -3, ... until it is.
 * `ignoreId` lets an update keep its own slug.
 */
export async function ensureUniqueSlug(
  ctx: QueryCtx | MutationCtx,
  desired: string,
  ignoreId?: Id<"content">,
): Promise<string> {
  const base = slugify(desired) || "untitled";

  for (let suffix = 1; suffix < 100; suffix += 1) {
    const candidate = suffix === 1 ? base : `${base}-${suffix}`;
    const existing = await ctx.db
      .query("content")
      .withIndex("by_slug", (q) => q.eq("slug", candidate))
      .unique();

    if (!existing || existing._id === ignoreId) return candidate;
  }

  throw new Error(`Could not find a free slug for "${desired}"`);
}
