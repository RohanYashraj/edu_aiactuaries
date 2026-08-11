import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { fetchQuery } from "@/lib/convex-server";
import { buildMetadata } from "@/lib/seo";
import { UsersTable } from "../_components/users-table";

export const metadata = buildMetadata({ title: "Users", noindex: true });

export default async function AdminUsersPage() {
  const { getToken } = await auth();

  // The admin layout lets content managers through; user management is
  // admin-only, so it gets its own check (and Convex enforces it again).
  const user = await fetchQuery(
    api.users.getCurrentUser,
    {},
    { token: (await getToken({ template: "convex" })) ?? undefined },
  );
  if (user?.role !== "admin") redirect("/admin");

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
