import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/onboarding(.*)",
]);

const isStaffRoute = createRouteMatcher([
  "/dashboard/(content|media|organisations|settings|users)(.*)",
]);

const CONTENT_ROLES = new Set(["admin", "content_manager"]);

type PublicMetadata = { role?: string };

/**
 * Authentication is enforced here; authorization is only hinted at.
 *
 * Middleware has no database access, so the staff check reads the Clerk
 * session-claim mirror of the Convex role. It can be stale or absent, so it
 * only ever *denies* on a known-wrong role — the authoritative gate is the
 * server-side check on each staff page under app/(dashboard)/dashboard/ and
 * `requireRole`/`requireContentManager`/`requireAdmin` in every Convex mutation.
 *
 * The role claim needs `publicMetadata` added to the session token (Clerk
 * Dashboard → Sessions → Customize session token). Without it the role reads as
 * undefined and staff routes simply fall through to the server-side gate —
 * degraded, not broken.
 *
 * The onboarding gate deliberately lives in app/(dashboard)/layout.tsx instead:
 * a brand-new user has empty publicMetadata, so a claims-based check could not
 * distinguish "not onboarded" from "claim missing".
 */
export default clerkMiddleware(async (auth, req) => {
  if (!isProtectedRoute(req)) return;

  const { sessionClaims } = await auth.protect();

  if (isStaffRoute(req)) {
    const role = (sessionClaims?.publicMetadata as PublicMetadata | undefined)?.role;
    if (role && !CONTENT_ROLES.has(role)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
