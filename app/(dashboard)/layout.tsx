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
        name={user?.name ?? "—"}
        role={user?.role}
      />
      <main className="min-w-0 flex-1 bg-muted/30 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
