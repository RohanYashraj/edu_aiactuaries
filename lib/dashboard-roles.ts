/**
 * Role label lookup shared by client and server dashboard code.
 *
 * Kept in its own module, separate from `lib/dashboard-user.ts`, because that
 * file imports `@clerk/nextjs/server` (a server-only module) — a client
 * component like the sidebar can't import anything from it, even a plain
 * constant, without breaking the client/server bundle boundary.
 */
export const ROLE_LABEL: Record<string, string> = {
  member: "Member",
  content_manager: "Content manager",
  admin: "Administrator",
};
