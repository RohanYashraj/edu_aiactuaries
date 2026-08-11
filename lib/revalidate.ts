"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";

import { api } from "@/convex/_generated/api";

/**
 * Flushes the ISR cache for the pages a content change affects, so an editor
 * sees their publish immediately rather than waiting out the revalidate
 * window. Without this, "I published it but the site shows the old version" is
 * the first support question the CMS generates.
 *
 * Server actions are public HTTP endpoints, so this re-checks the caller's role
 * against Convex rather than trusting the client.
 */
export async function revalidateContent(paths: string[]) {
  const { userId, getToken } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const caller = await fetchQuery(
    api.users.getCurrentUser,
    {},
    { token: (await getToken({ template: "convex" })) ?? undefined },
  );

  if (caller?.role !== "admin" && caller?.role !== "content_manager") {
    throw new Error("Forbidden");
  }

  for (const path of paths) {
    if (typeof path === "string" && path.startsWith("/")) revalidatePath(path);
  }
}
