import { redirect } from "next/navigation";

import { getDashboardSession, isAdmin } from "@/lib/dashboard-user";
import { buildMetadata } from "@/lib/seo";
import { UsersTable } from "../_components/users-table";

export const metadata = buildMetadata({ title: "Users", noindex: true });

export default async function AdminUsersPage() {
  // User management is admin-only, so it gets its own check beyond the
  // staff check (and Convex enforces it again).
  const { user } = await getDashboardSession();
  if (!isAdmin(user)) redirect("/dashboard");

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl tracking-tight sm:text-3xl">
          Users
        </h1>
        <p className="mt-1 text-muted-foreground">
          Members, content managers and administrators.
        </p>
      </header>
      <UsersTable />
    </div>
  );
}
