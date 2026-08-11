import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

import { api } from "@/convex/_generated/api";
import { fetchQuery } from "@/lib/convex-server";
import { AdminNav } from "./_components/admin-nav";

/**
 * Authoritative authorization gate. The middleware check in proxy.ts reads a
 * Clerk metadata mirror that can be stale or missing, so the real decision is
 * made here against Convex — and again inside every contentAdmin mutation.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await fetchQuery(
    api.users.getCurrentUser,
    {},
    { token: (await getToken({ template: "convex" })) ?? undefined },
  );

  const isAdmin = user?.role === "admin";
  if (!isAdmin && user?.role !== "content_manager") redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-primary-foreground/10 bg-primary text-primary-foreground">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-gold text-xs font-bold text-gold-foreground shadow-sm">
              edu.
            </span>
            <span className="text-sm font-semibold tracking-tight">
              Admin
              <span className="ml-1.5 text-xs font-normal text-primary-foreground/60">
                {isAdmin ? "Administrator" : "Content Manager"}
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm text-primary-foreground/70 hover:text-primary-foreground"
            >
              Dashboard
            </Link>
            <Link
              href="/"
              className="text-sm text-primary-foreground/70 hover:text-primary-foreground"
            >
              View site
            </Link>
            <UserButton
              afterSignOutUrl="/"
              appearance={{ elements: { avatarBox: "size-8" } }}
            />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-8 sm:px-6">
        <AdminNav isAdmin={isAdmin} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
