# Unified role-aware dashboard

Date: 2026-08-12
Status: approved, ready for implementation planning

## Problem

The authenticated area is two products wearing different clothes.

`app/(dashboard)/layout.tsx` renders a top-bar shell for members: an "edu. SSS CoE
Dashboard" wordmark, nav links for Overview / Profile / Account, a "Back to Site"
button, and — only for content managers and admins — an "Admin" button that jumps to
an entirely different shell. `app/(admin)/admin/layout.tsx` renders that second shell,
with its own sidebar (`admin-nav.tsx`).

Three problems follow:

1. **The seam.** Staff mentally context-switch between "my dashboard" and "the CMS".
   The Admin button exists only because `/admin` is a different place; hiding it
   without merging the areas would leave the seam and remove the bridge.
2. **Chrome noise.** The wordmark block and "Back to Site" button occupy the top bar
   without earning it.
3. **Profile/Account duplication.** `/dashboard/profile` edits the Convex profile
   (headline, career stage, institution, actuarial body, exams, LinkedIn, interests).
   `/dashboard/account` shows a read-only Clerk mirror — avatar, name, email,
   username, user ID, role, joined date. Its heading says "Account" but its only card
   is titled "Profile", and it instructs the user to edit elsewhere. Both pages render
   an identity block; neither lets you edit it in place.

## Goals

One shell for every role. The view differs by role; the surface does not. No "admin"
destination, no mode switch, no duplicated identity block.

## Non-goals

- Restyling page internals. Tables, forms, editors and cards keep their current
  visual language. (Decided: restyle the shell only.)
- Adding content discovery to the member Overview. The public site is the discovery
  surface. (Decided: Overview stays personal.)
- Any change to Convex authorization. `requireContentManager` / `requireAdmin` remain
  the enforcement point and are untouched.

## Architecture

### Routes

Everything moves under `/dashboard/*`. The `(admin)` route group is deleted.

| New route | Access | Source |
|---|---|---|
| `/dashboard` | all | `(dashboard)/dashboard/page.tsx`, extended |
| `/dashboard/profile` | all | merged profile + account |
| `/dashboard/content` | staff | from `/admin/content` |
| `/dashboard/content/new` | staff | from `/admin/content/new` |
| `/dashboard/content/[id]` | staff | from `/admin/content/[id]` |
| `/dashboard/media` | staff | from `/admin/media` |
| `/dashboard/organisations` | staff | from `/admin/organizations` |
| `/dashboard/settings` | staff | from `/admin/settings` |
| `/dashboard/users` | admin | from `/admin/users` |

"Staff" means `content_manager` or `admin` — the existing `CONTENT_ROLES` set in
`convex/lib/auth.ts:6`.

Note the spelling change: `/admin/organizations` becomes `/dashboard/organisations`,
matching the "Organisations" label already used in `admin-nav.tsx:22`.

### Redirects

Added to the existing `redirects()` array in `next.config.ts` (which already holds six
permanent redirects — follow that pattern):

```
/admin                    -> /dashboard
/admin/content/:path*     -> /dashboard/content/:path*
/admin/media              -> /dashboard/media
/admin/organizations      -> /dashboard/organisations
/admin/settings           -> /dashboard/settings
/admin/users              -> /dashboard/users
/dashboard/account        -> /dashboard/profile
```

All permanent. These are noindex surfaces, so the only consumers are bookmarks and
muscle memory.

### Shell

`app/(dashboard)/layout.tsx` becomes the single authenticated shell: a fixed left
sidebar plus a slim top bar over a muted canvas.

```
┌────────────────┬──────────────────────────────────────────┐
│  edu. SSSIA    │  Content                    [+ New]      │
│  (→ "/")       │                                          │
├────────────────┼──────────────────────────────────────────┤
│  Overview      │                                          │
│ ▓ Content      │   {children}                             │
│  Media         │                                          │
│  Organisations │                                          │
│  ────────────  │                                          │
│  Users         │                                          │
│  Settings      │                                          │
├────────────────┤                                          │
│ 🅡 Rohan Gupta │                                          │
│   Admin        │                                          │
└────────────────┴──────────────────────────────────────────┘
```

- **Brand mark** (sidebar top) links to `/`. This replaces the "Back to Site" button —
  the conventional location, and it removes a button rather than moving one.
- **Nav** uses the current `lucide-react` icons from `admin-nav.tsx`. Active item is a
  filled pill. Active matching keeps the existing rule from `admin-nav.tsx:39-41`:
  exact match for the index route, `startsWith` for the rest.
- **User block** (sidebar foot) shows avatar, name and role badge, and wraps Clerk's
  `<UserButton />` — which keeps sign-out and Clerk's own account-management modal
  reachable without a bespoke menu.
- **No top bar component.** Every page already renders its own `<h1>` and its own
  primary action (`content-table.tsx:110` owns the "New" button), so a title bar in
  the layout would duplicate what pages own. On mobile, where the sidebar collapses,
  a slim bar appears carrying only the brand mark and a menu button that opens the
  nav in a `Sheet`.

Removed: the wordmark block, "Back to Site", the "Admin" button, the header
`UserButton`, `AdminNav`, and the whole `app/(admin)/` directory.

### Role resolution

The layout resolves the user once and passes `role` to the sidebar:

```ts
const token = await getToken({ template: "convex" });
const user = token ? await fetchQuery(api.users.getCurrentUser, {}, { token }) : null;
```

This is the pattern already in `(admin)/admin/layout.tsx`, including its distinction
between "not allowed" and "couldn't ask" — a null token means the Clerk `convex` JWT
template is missing and must render the existing explanatory screen, not a silent
bounce. **That error-state handling must be preserved when the layout is rewritten.**

The onboarding gate from `(dashboard)/layout.tsx:39` also moves into the new layout
unchanged: redirect to `/onboarding` when `user && !user.onboardingCompletedAt`.

Authorization stays defence-in-depth, three layers, none removed:

1. `proxy.ts` — a redirect hint from the possibly-stale Clerk session claim.
2. Each staff page — an authoritative Convex check (the pattern in
   `admin/users/page.tsx:21`).
3. Convex functions — `requireContentManager` / `requireAdmin`.

### proxy.ts

`isProtectedRoute` stays `/dashboard(.*)` and `/onboarding(.*)`; `/admin(.*)` can be
dropped once the redirects land, because `next.config.ts` redirects are evaluated
before middleware.

`isAdminRoute` is replaced by `isStaffRoute`, matching the staff paths:

```ts
const isStaffRoute = createRouteMatcher([
  "/dashboard/(content|media|organisations|settings|users)(.*)",
]);
```

The existing deny-only semantics are preserved: redirect to `/dashboard` only on a
known-wrong role, never on a missing claim.

### Merged profile

`/dashboard/profile` renders two sections on one page. `/dashboard/account` is deleted.

**Identity** (read-only, from Clerk via `currentUser()`): avatar, full name, email,
member-since, role badge, and Clerk's account-management entry point for email and
password. Drops the raw user ID — a debugging detail with no user value.

**Professional profile**: the existing `ProfileForm` component, unchanged.

### Role-aware Overview

`/dashboard` renders shared personal sections for everyone, with a staff layer above:

- **All roles**: greeting, "Your registrations", "Saved" — the current
  `dashboard-content.tsx`, minus its redundant "Account" card (line 209), which the
  merged profile page now owns.
- **Staff additionally**: a stats band and recent-content list above the personal
  sections — the current `admin-overview.tsx`, reusing `api.contentAdmin.stats` and
  `api.contentAdmin.list`.

## Components

| File | Change |
|---|---|
| `app/(dashboard)/layout.tsx` | rewritten: sidebar + top bar shell, role resolution, onboarding gate, JWT-missing error state |
| `app/(dashboard)/_components/dashboard-sidebar.tsx` | new: role-filtered nav, brand mark, user block, mobile sheet |
| `lib/dashboard-user.ts` | new: shared session/role resolution for the layout and every gated page |
| `app/(dashboard)/dashboard/page.tsx` | role-aware composition |
| `app/(dashboard)/dashboard/_components/dashboard-content.tsx` | drop the Account card |
| `app/(dashboard)/dashboard/profile/page.tsx` | add identity section |
| `app/(dashboard)/dashboard/account/page.tsx` | deleted |
| `app/(admin)/**` | pages move under `(dashboard)/dashboard/`; `layout.tsx` and `admin-nav.tsx` deleted |
| `next.config.ts` | seven redirects appended |
| `proxy.ts` | `isAdminRoute` → `isStaffRoute` |

Admin `_components` (content-editor, content-table, media-library,
organizations-manager, settings-form, users-table, and friends) move to
`app/(dashboard)/dashboard/_components/` with import paths updated. Their internals
do not change.

## Verification

Build and lint must pass, then per role on a preview deployment:

- **Member**: sidebar shows Overview and Profile only. `/dashboard/content` and
  `/dashboard/users` redirect to `/dashboard`. No Admin button anywhere.
- **Content manager**: Content, Media, Organisations, Settings appear; Users does not.
  `/dashboard/users` redirects. Content editing still saves.
- **Admin**: all items appear; `/dashboard/users` opens and role changes still apply.
- **Redirects**: each `/admin/*` path lands on its `/dashboard/*` equivalent;
  `/dashboard/account` lands on `/dashboard/profile`.
- **Profile**: identity section shows Clerk data; the professional form still saves to
  Convex.
- **Regression**: a user mid-onboarding is still redirected to `/onboarding`; a user
  whose Clerk `convex` JWT template is missing still sees the explanatory screen
  rather than a bounce.

## Risks

- **The layout rewrite is the risky change.** It carries three behaviours that are
  easy to drop: the onboarding gate, the null-token error state, and the
  member-vs-staff distinction. Each is called out above and each has a verification
  step.
- **Moving admin `_components` touches many import paths.** Mechanical, but a missed
  import fails the build rather than failing quietly — acceptable.
