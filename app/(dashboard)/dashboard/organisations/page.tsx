import { redirect } from "next/navigation";

import { gateStaff } from "@/lib/dashboard-user";
import { buildMetadata } from "@/lib/seo";
import { AccountSyncing } from "../_components/account-syncing";
import { OrganizationsManager } from "../_components/organizations-manager";

export const metadata = buildMetadata({ title: "Organisations", noindex: true });

export default async function AdminOrganizationsPage() {
  const gate = await gateStaff();
  if (gate.status === "denied") redirect("/dashboard");
  if (gate.status === "syncing") return <AccountSyncing />;

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl tracking-tight sm:text-3xl">
          Organisations
        </h1>
        <p className="mt-1 text-muted-foreground">
          Partner bodies and their logos. Anything featured here appears in the
          recognition strip on the homepage and about page.
        </p>
      </header>
      <OrganizationsManager />
    </div>
  );
}
