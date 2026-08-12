# Unified Role-Aware Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merge the member dashboard and the admin CMS into one shell under `/dashboard/*` whose sidebar is filtered by role, and merge the duplicated Profile and Account pages.

**Architecture:** The `(admin)` route group is deleted; its pages move into `(dashboard)` and each gains its own authoritative Convex role gate. A single `lib/dashboard-user.ts` helper resolves the signed-in user once and is shared by the layout and every gated page. `(dashboard)/layout.tsx` becomes a sidebar shell. `next.config.ts` redirects the old `/admin/*` URLs.

**Tech Stack:** Next 16 App Router, React 19, Convex, Clerk, Tailwind 4, shadcn/ui primitives in `components/ui/`, `lucide-react` icons.

## Global Constraints

- **No test framework exists in this repo.** There is no `test` script and no test files. Do not add one. Every task gates on `pnpm lint && pnpm build` plus the explicit route/role checks written into that task.
- **Package manager is pnpm.** Never run `npm` or `yarn`.
- **Never weaken authorization.** `requireContentManager` / `requireAdmin` in `convex/` are untouched by this plan. Page-level gates are defence in depth *added on top*, never a replacement.
- **Staff** means role `content_manager` or `admin`. **Admin-only** means role `admin`.
- **British spelling in the new URL:** `/dashboard/organisations` (the label in the old `admin-nav.tsx:22` was already "Organisations").
- **All authenticated pages are `noindex`** via `buildMetadata({ ..., noindex: true })`. Preserve that on every moved page.
- Commit after every task. Do not squash tasks together.

---

### Task 1: Shared user resolution helper

**Files:**
- Create: `lib/dashboard-user.ts`

**Interfaces:**
- Consumes: `api.users.getCurrentUser` (existing Convex query), `fetchQuery` from `lib/convex-server.ts`.
- Produces: `getDashboardSession(): Promise<DashboardSession>`, `isStaff(user)`, `isAdmin(user)`, types `DashboardUser`, `DashboardSession`. Tasks 2–5 all import from here.

The `token: null` case matters and is easy to lose. `(admin)/admin/layout.tsx` currently distinguishes "you're not allowed" from "I couldn't check" — a missing Clerk `convex` JWT template yields a null token, and bouncing that user to `/dashboard` reads as "the CMS is broken". This helper preserves that distinction by returning both values.

- [ ] **Step 1: Create the helper**

```ts
// lib/dashboard-user.ts
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
```

- [ ] **Step 2: Verify it compiles**

Run: `pnpm lint && pnpm build`
Expected: both succeed. The file is not imported yet, so no behaviour changes.

- [ ] **Step 3: Commit**

```bash
git add lib/dashboard-user.ts
git commit -m "Add shared dashboard session helper"
```

---

### Task 2: Move staff pages under /dashboard

**Files:**
- Create: `app/(dashboard)/dashboard/content/page.tsx`, `content/new/page.tsx`, `content/[id]/page.tsx`, `media/page.tsx`, `organisations/page.tsx`, `settings/page.tsx`, `users/page.tsx`
- Create: `app/(dashboard)/dashboard/_components/` — move all files from `app/(admin)/admin/_components/` except `admin-nav.tsx`
- Delete: `app/(admin)/` entirely (including `layout.tsx` and `admin-nav.tsx`)
- Modify: `next.config.ts:16-30` (redirects array)

**Interfaces:**
- Consumes: `getDashboardSession`, `isStaff`, `isAdmin` from Task 1.
- Produces: working `/dashboard/{content,media,organisations,settings,users}` routes. Task 3's sidebar links to exactly these paths.

At the end of this task the staff pages render inside the *existing* member layout (top bar with the Admin button). That intermediate state is expected and builds fine; Task 3 replaces the shell.

Use `git mv` so history follows the files.

- [ ] **Step 1: Move the component directory**

```bash
mkdir -p "app/(dashboard)/dashboard/_components"
git mv "app/(admin)/admin/_components/admin-overview.tsx" "app/(dashboard)/dashboard/_components/admin-overview.tsx"
git mv "app/(admin)/admin/_components/content-editor.tsx" "app/(dashboard)/dashboard/_components/content-editor.tsx"
git mv "app/(admin)/admin/_components/content-registrations.tsx" "app/(dashboard)/dashboard/_components/content-registrations.tsx"
git mv "app/(admin)/admin/_components/content-table.tsx" "app/(dashboard)/dashboard/_components/content-table.tsx"
git mv "app/(admin)/admin/_components/cover-image-field.tsx" "app/(dashboard)/dashboard/_components/cover-image-field.tsx"
git mv "app/(admin)/admin/_components/details-fields.tsx" "app/(dashboard)/dashboard/_components/details-fields.tsx"
git mv "app/(admin)/admin/_components/media-library.tsx" "app/(dashboard)/dashboard/_components/media-library.tsx"
git mv "app/(admin)/admin/_components/organizations-manager.tsx" "app/(dashboard)/dashboard/_components/organizations-manager.tsx"
git mv "app/(admin)/admin/_components/settings-form.tsx" "app/(dashboard)/dashboard/_components/settings-form.tsx"
git mv "app/(admin)/admin/_components/status-badge.tsx" "app/(dashboard)/dashboard/_components/status-badge.tsx"
git mv "app/(admin)/admin/_components/users-table.tsx" "app/(dashboard)/dashboard/_components/users-table.tsx"
```

- [ ] **Step 2: Move the page files**

```bash
mkdir -p "app/(dashboard)/dashboard/content/new" "app/(dashboard)/dashboard/content/[id]" \
         "app/(dashboard)/dashboard/media" "app/(dashboard)/dashboard/organisations" \
         "app/(dashboard)/dashboard/settings" "app/(dashboard)/dashboard/users"
git mv "app/(admin)/admin/content/page.tsx"        "app/(dashboard)/dashboard/content/page.tsx"
git mv "app/(admin)/admin/content/new/page.tsx"    "app/(dashboard)/dashboard/content/new/page.tsx"
git mv "app/(admin)/admin/content/[id]/page.tsx"   "app/(dashboard)/dashboard/content/[id]/page.tsx"
git mv "app/(admin)/admin/media/page.tsx"          "app/(dashboard)/dashboard/media/page.tsx"
git mv "app/(admin)/admin/organizations/page.tsx"  "app/(dashboard)/dashboard/organisations/page.tsx"
git mv "app/(admin)/admin/settings/page.tsx"       "app/(dashboard)/dashboard/settings/page.tsx"
git mv "app/(admin)/admin/users/page.tsx"          "app/(dashboard)/dashboard/users/page.tsx"
git rm -r "app/(admin)"
```

`app/(admin)/admin/page.tsx` is deleted rather than moved — its `AdminOverview` is folded into the role-aware Overview in Task 5. `admin-overview.tsx` itself was moved in Step 1 and is used there.

- [ ] **Step 3: Fix component import paths**

In the moved page files, `../_components/x` and `./_components/x` now resolve differently. Set every page's component import to the absolute alias:

- `content/page.tsx`: `import { ContentTable } from "@/app/(dashboard)/dashboard/_components/content-table";`
- `content/new/page.tsx` and `content/[id]/page.tsx`: import `ContentEditor` from `@/app/(dashboard)/dashboard/_components/content-editor` (keep any other imports these files already have, adjusting the same way).
- `media/page.tsx`: `MediaLibrary` from `@/app/(dashboard)/dashboard/_components/media-library`
- `organisations/page.tsx`: `OrganizationsManager` from `@/app/(dashboard)/dashboard/_components/organizations-manager`
- `settings/page.tsx`: `SettingsForm` from `@/app/(dashboard)/dashboard/_components/settings-form`
- `users/page.tsx`: `UsersTable` from `@/app/(dashboard)/dashboard/_components/users-table`

Do the same for cross-imports *between* moved components (e.g. `content-table.tsx` importing `status-badge`) — relative sibling imports like `./status-badge` still resolve correctly and need no change. Only `../_components/` paths need rewriting.

- [ ] **Step 4: Rewrite internal /admin links**

Four files hold hardcoded `/admin` links:

- `_components/admin-overview.tsx:49` → `/dashboard/content/new`
- `_components/admin-overview.tsx:55` → `/dashboard/content`
- `_components/content-editor.tsx:278` → `` router.push(`/dashboard/content/${saved}`) ``
- `_components/content-editor.tsx:299` → `/dashboard/content`
- `_components/content-table.tsx:110` → `/dashboard/content/new`

Verify none remain: `grep -rn '"/admin' app/ components/ lib/` should return only `app/robots.ts`.

- [ ] **Step 5: Add the role gate to each staff page**

`users/page.tsx` already has an admin check (its current lines 12-21) — replace its body's auth block with the helper, keeping `redirect("/dashboard")`:

```tsx
import { redirect } from "next/navigation";

import { getDashboardSession, isAdmin } from "@/lib/dashboard-user";

// ...inside the component, before the return:
const { user } = await getDashboardSession();
if (!isAdmin(user)) redirect("/dashboard");
```

Add the staff equivalent to `content/page.tsx`, `content/new/page.tsx`, `content/[id]/page.tsx`, `media/page.tsx`, `organisations/page.tsx`, `settings/page.tsx`. Each becomes an `async` function if it isn't already:

```tsx
import { redirect } from "next/navigation";

import { getDashboardSession, isStaff } from "@/lib/dashboard-user";

export default async function ContentPage() {
  const { user } = await getDashboardSession();
  if (!isStaff(user)) redirect("/dashboard");

  return (
    // ...existing JSX unchanged
  );
}
```

Keep each page's existing `metadata` export and `<h1>` header exactly as they are.

- [ ] **Step 6: Add redirects**

In `next.config.ts`, inside the array returned by `redirects()` (currently lines 16-30), append:

```ts
      // The admin CMS moved under /dashboard so there is one authenticated
      // surface, filtered by role, rather than two.
      { source: "/admin", destination: "/dashboard", permanent: true },
      { source: "/admin/content/:path*", destination: "/dashboard/content/:path*", permanent: true },
      { source: "/admin/media", destination: "/dashboard/media", permanent: true },
      { source: "/admin/organizations", destination: "/dashboard/organisations", permanent: true },
      { source: "/admin/settings", destination: "/dashboard/settings", permanent: true },
      { source: "/admin/users", destination: "/dashboard/users", permanent: true },
```

- [ ] **Step 7: Verify build and routes**

Run: `pnpm lint && pnpm build`
Expected: both succeed. In the build's route list, confirm `/dashboard/content`, `/dashboard/content/[id]`, `/dashboard/media`, `/dashboard/organisations`, `/dashboard/settings`, `/dashboard/users` appear and no `/admin/*` routes remain.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Move the admin CMS under /dashboard

Each staff page now carries its own Convex role gate, which the deleted
(admin) layout used to provide for all of them."
```

---

### Task 3: Sidebar shell

**Files:**
- Create: `app/(dashboard)/_components/dashboard-sidebar.tsx`
- Modify: `app/(dashboard)/layout.tsx` (full rewrite)

**Interfaces:**
- Consumes: `getDashboardSession`, `isStaff`, `isAdmin` from Task 1; the routes from Task 2.
- Produces: `<DashboardSidebar staff={boolean} admin={boolean} name={string} role={string} />`.

Pages keep their own `<h1>` and primary action buttons, so there is no top bar component — one would duplicate what pages already render.

- [ ] **Step 1: Create the sidebar**

```tsx
// app/(dashboard)/_components/dashboard-sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  Building2,
  ImageIcon,
  LayoutDashboard,
  Menu,
  Newspaper,
  Settings,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Access = "all" | "staff" | "admin";

type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  access: Access;
};

const LINKS: NavLink[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, access: "all" },
  { href: "/dashboard/profile", label: "Profile", icon: User, access: "all" },
  { href: "/dashboard/content", label: "Content", icon: Newspaper, access: "staff" },
  { href: "/dashboard/media", label: "Media", icon: ImageIcon, access: "staff" },
  { href: "/dashboard/organisations", label: "Organisations", icon: Building2, access: "staff" },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, access: "staff" },
  { href: "/dashboard/users", label: "Users", icon: Users, access: "admin" },
];

const ROLE_LABEL: Record<string, string> = {
  member: "Member",
  content_manager: "Content manager",
  admin: "Administrator",
};

export type DashboardSidebarProps = {
  staff: boolean;
  admin: boolean;
  name: string;
  role: string;
};

function visibleLinks(staff: boolean, admin: boolean): NavLink[] {
  return LINKS.filter((link) =>
    link.access === "all"
      ? true
      : link.access === "staff"
        ? staff
        : admin,
  );
}

function NavList({
  staff,
  admin,
  onNavigate,
}: {
  staff: boolean;
  admin: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <ul className="space-y-1">
      {visibleLinks(staff, admin).map(({ href, label, icon: Icon }) => {
        // Exact match for the index route so it isn't active on every child.
        const active =
          href === "/dashboard" ? pathname === href : pathname.startsWith(href);

        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-secondary font-medium text-foreground"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function BrandMark() {
  // Links to the public site — this replaces the old "Back to Site" button.
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex size-8 items-center justify-center rounded-lg bg-gold text-xs font-bold text-gold-foreground shadow-sm">
        edu.
      </span>
      <span className="text-sm font-semibold tracking-tight">SSSIA</span>
    </Link>
  );
}

function UserBlock({ name, role }: { name: string; role: string }) {
  return (
    <div className="flex items-center gap-3 border-t border-border px-3 py-4">
      <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "size-8" } }} />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {ROLE_LABEL[role] ?? "Member"}
        </p>
      </div>
    </div>
  );
}

export function DashboardSidebar({ staff, admin, name, role }: DashboardSidebarProps) {
  return (
    <>
      {/* Desktop: fixed rail */}
      <aside className="hidden w-60 shrink-0 border-r border-border bg-background md:flex md:flex-col">
        <div className="px-3 py-4">
          <BrandMark />
        </div>
        <nav className="flex-1 px-3">
          <NavList staff={staff} admin={admin} />
        </nav>
        <UserBlock name={name} role={role} />
      </aside>

      {/* Mobile: top bar with a sheet */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3 md:hidden">
        <BrandMark />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
            <div className="flex h-full flex-col">
              <div className="px-3 py-4">
                <BrandMark />
              </div>
              <nav className="flex-1 px-3">
                <NavList staff={staff} admin={admin} />
              </nav>
              <UserBlock name={name} role={role} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Rewrite the layout**

Replaces `app/(dashboard)/layout.tsx` entirely. Three behaviours from the old layouts must survive: the onboarding gate, the null-token explanation, and the member/staff distinction.

```tsx
// app/(dashboard)/layout.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { DashboardSidebar } from "./_components/dashboard-sidebar";
import { getDashboardSession, isAdmin, isStaff } from "@/lib/dashboard-user";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { token, user } = await getDashboardSession();

  // Distinguish "not allowed" from "couldn't ask". A null token means the Clerk
  // JWT template named "convex" is missing; bouncing here would read as "the
  // dashboard is broken" with no explanation.
  if (!token) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 text-center">
        <h1 className="font-display text-2xl tracking-tight">
          Can&apos;t verify your account
        </h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Authentication isn&apos;t configured correctly — the Clerk JWT template
          named “convex” is missing.
        </p>
        <Link href="/" className="mt-6 text-sm underline underline-offset-4 hover:text-foreground">
          Back to site
        </Link>
      </div>
    );
  }

  // Authoritative onboarding gate. The middleware can't do this — a brand-new
  // user has no publicMetadata to read. `user` is null only in the brief window
  // before the Clerk webhook creates the Convex row; don't bounce for that.
  if (user && !user.onboardingCompletedAt) redirect("/onboarding");

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <DashboardSidebar
        staff={isStaff(user)}
        admin={isAdmin(user)}
        name={user?.name ?? "Member"}
        role={user?.role ?? "member"}
      />
      <main className="min-w-0 flex-1 bg-muted/30 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `pnpm lint && pnpm build`
Expected: both succeed.

- [ ] **Step 4: Verify by eye**

Run `pnpm dev`, sign in, and confirm on `/dashboard`:
- Sidebar shows Overview and Profile only (the dev user's role governs this).
- No "SSS CoE Dashboard" wordmark, no "Back to Site" button, no "Admin" button.
- The brand mark navigates to `/`.
- At a narrow viewport the sidebar collapses to a top bar whose menu button opens the sheet.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Replace the dashboard and admin headers with one sidebar shell"
```

---

### Task 4: Merge Profile and Account

**Files:**
- Modify: `app/(dashboard)/dashboard/profile/page.tsx`
- Delete: `app/(dashboard)/dashboard/account/page.tsx`
- Modify: `next.config.ts` (redirects — one edit, one addition)

**Interfaces:**
- Consumes: existing `ProfileForm` from `./_components/profile-form` (unchanged).
- Produces: `/dashboard/profile` as the single identity + profile surface.

The existing `/account` → `/dashboard/account` redirect must be *retargeted*, not left to chain through a deleted route.

- [ ] **Step 1: Rewrite the profile page**

```tsx
// app/(dashboard)/dashboard/profile/page.tsx
import { currentUser } from "@clerk/nextjs/server";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";
import { getDashboardSession } from "@/lib/dashboard-user";
import { ProfileForm } from "./_components/profile-form";

export const metadata = buildMetadata({
  title: "Profile",
  path: "/dashboard/profile",
  noindex: true,
});

const ROLE_LABEL: Record<string, string> = {
  member: "Member",
  content_manager: "Content manager",
  admin: "Administrator",
};

export default async function ProfilePage() {
  const clerkUser = await currentUser();
  const { user } = await getDashboardSession();

  const initials = [clerkUser?.firstName, clerkUser?.lastName]
    .filter(Boolean)
    .map((part) => part![0])
    .join("")
    .toUpperCase();

  const joined = clerkUser
    ? new Date(clerkUser.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <header>
        <h1 className="font-display text-2xl tracking-tight sm:text-3xl">
          Your Profile
        </h1>
        <p className="mt-1 text-muted-foreground">
          Keep this current so we can point the right programs and opportunities
          your way.
        </p>
      </header>

      {/* Identity — read-only, owned by Clerk. Editing email or password happens
          in Clerk's own UI, reachable from the avatar menu in the sidebar. */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-4 py-6">
          <Avatar className="size-16">
            <AvatarImage src={clerkUser?.imageUrl} alt={clerkUser?.fullName ?? "User"} />
            <AvatarFallback className="text-lg">{initials || "U"}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-medium">{clerkUser?.fullName || user?.name || "User"}</p>
            <p className="truncate text-sm text-muted-foreground">
              {clerkUser?.primaryEmailAddress?.emailAddress ?? user?.email}
            </p>
            {joined ? (
              <p className="mt-1 text-xs text-muted-foreground">Member since {joined}</p>
            ) : null}
          </div>
          <Badge variant="secondary">{ROLE_LABEL[user?.role ?? "member"] ?? "Member"}</Badge>
        </CardContent>
      </Card>

      <ProfileForm />
    </div>
  );
}
```

- [ ] **Step 2: Delete the account page**

```bash
git rm "app/(dashboard)/dashboard/account/page.tsx"
```

- [ ] **Step 3: Fix the redirects**

In `next.config.ts`, change the existing line 19 so it no longer targets a deleted route, and add the new one:

```ts
      { source: "/account", destination: "/dashboard/profile", permanent: true },
      { source: "/dashboard/account", destination: "/dashboard/profile", permanent: true },
```

- [ ] **Step 4: Verify**

Run: `pnpm lint && pnpm build`
Expected: both succeed, and `/dashboard/account` no longer appears in the route list.

With `pnpm dev` running, confirm `/dashboard/profile` shows the identity card above the form, the form still saves, and `/dashboard/account` and `/account` both land on `/dashboard/profile`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Merge the Account page into Profile

Both pages rendered an identity block and neither let you edit it in
place; Account's only card was even titled Profile."
```

---

### Task 5: Role-aware Overview

**Files:**
- Modify: `app/(dashboard)/dashboard/page.tsx`
- Modify: `app/(dashboard)/dashboard/_components/dashboard-content.tsx:206-229` (remove the Account card)
- Modify: `proxy.ts:10,39-44`

**Interfaces:**
- Consumes: `getDashboardSession`, `isStaff` from Task 1; `AdminOverview` from `./_components/admin-overview` (moved in Task 2).
- Produces: the final `/dashboard`.

- [ ] **Step 1: Compose the overview by role**

```tsx
// app/(dashboard)/dashboard/page.tsx
import { buildMetadata } from "@/lib/seo";
import { getDashboardSession, isStaff } from "@/lib/dashboard-user";
import { AdminOverview } from "./_components/admin-overview";
import { DashboardContent } from "./_components/dashboard-content";

export const metadata = buildMetadata({
  title: "Dashboard",
  path: "/dashboard",
  noindex: true,
});

export default async function DashboardPage() {
  const { user } = await getDashboardSession();

  return (
    <div className="space-y-10">
      {/* Staff get a working layer above their personal sections — they keep the
          member view rather than trading it for a CMS view. */}
      {isStaff(user) ? <AdminOverview /> : null}
      <DashboardContent />
    </div>
  );
}
```

This replaces the file wholesale. The current version is only
`export default function DashboardPage() { return <DashboardContent />; }` plus a
hand-rolled `metadata` object, so nothing else is lost.

Note the metadata change: the old object set a title and OG images but **no
`noindex`** — the one authenticated page missing it. `robots.ts` disallows
`/dashboard` so it was never exposed, but `buildMetadata({ noindex: true })` makes the
page agree with its neighbours.

- [ ] **Step 2: Remove the duplicated Account card**

In `app/(dashboard)/dashboard/_components/dashboard-content.tsx`, delete the whole `<Card>` block that starts at line 206 with `<CardHeader className="flex flex-row items-center gap-3 space-y-0">` and contains `<CardTitle className="text-base">Account</CardTitle>`, through its closing `</Card>` at line 229. The merged Profile page now owns this.

Remove the now-unused `User` icon import and any `Card`/`CardHeader`/`CardTitle`/`CardContent` imports that become unused — `pnpm lint` will flag them.

- [ ] **Step 3: Update proxy.ts**

Replace the `isAdminRoute` matcher (line 10) and the block that uses it (lines 39-44):

```ts
const isStaffRoute = createRouteMatcher([
  "/dashboard/(content|media|organisations|settings|users)(.*)",
]);
```

```ts
  if (isStaffRoute(req)) {
    const role = (sessionClaims?.publicMetadata as PublicMetadata | undefined)?.role;
    if (role && !CONTENT_ROLES.has(role)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }
```

Also drop `"/admin(.*)"` from `isProtectedRoute` (line 7) — `next.config.ts` redirects are evaluated before middleware, so those paths never reach it.

Keep the deny-only semantics: redirect only on a known-wrong role, never on a missing claim. Update the file's header comment, which still describes an "admin check" and `app/(admin)/admin/layout.tsx` — the authoritative gate now lives on each staff page.

- [ ] **Step 4: Verify**

Run: `pnpm lint && pnpm build`
Expected: both succeed.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Make the dashboard overview role-aware and retarget the staff route matcher"
```

---

### Task 6: End-to-end role verification

**Files:** none — verification only.

This must run against a **preview deployment**, not local dev, because it needs all three roles and the production-shaped Clerk setup. Push the branch and let Vercel build a preview.

- [ ] **Step 1: Verify as a member**

- Sidebar shows Overview and Profile only.
- `/dashboard/content`, `/dashboard/media`, `/dashboard/organisations`, `/dashboard/settings`, `/dashboard/users` each redirect to `/dashboard`.
- No "Admin" button anywhere.

- [ ] **Step 2: Verify as a content manager**

- Sidebar adds Content, Media, Organisations, Settings. Users is absent.
- `/dashboard/users` redirects to `/dashboard`.
- Creating and saving a content item still works, and saving a new item lands on `/dashboard/content/<id>`.

- [ ] **Step 3: Verify as an admin**

- Sidebar shows every item.
- `/dashboard/users` opens and a role change still applies.

- [ ] **Step 4: Verify redirects**

Each must land on its new home: `/admin`, `/admin/content`, `/admin/content/<some-id>`, `/admin/media`, `/admin/organizations`, `/admin/settings`, `/admin/users`, `/dashboard/account`, `/account`.

- [ ] **Step 5: Verify the preserved behaviours**

- A user who hasn't finished onboarding is still redirected to `/onboarding`.
- Removing the Clerk `convex` JWT template (or testing with a session that lacks it) shows the "Can't verify your account" screen rather than a bounce. If you can't easily produce that state, read `(dashboard)/layout.tsx` and confirm the `!token` branch is intact and returns the explanation.

- [ ] **Step 6: Merge**

Once all three roles check out, merge to `main`. The push deploys Convex and Vercel together.

---

## Notes for the implementer

- **The layout rewrite in Task 3 is the risky change.** It carries the onboarding gate, the null-token error state, and the member/staff distinction. Losing any of them is a silent regression that the build will not catch — which is why Task 6 checks each explicitly.
- **You are currently `role: "member"` in production.** Testing Tasks 2–6 as staff requires promoting an account first (Convex dashboard → Functions → `migrations:promoteToAdmin`).
- Partner logos on content pages render from inline `logoPath`, so they are not affected by anything in this plan.
