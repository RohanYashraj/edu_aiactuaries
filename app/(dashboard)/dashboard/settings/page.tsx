import { redirect } from "next/navigation";

import { gateStaff } from "@/lib/dashboard-user";
import { buildMetadata } from "@/lib/seo";
import { AccountSyncing } from "../_components/account-syncing";
import { SettingsForm } from "../_components/settings-form";

export const metadata = buildMetadata({ title: "Settings", noindex: true });

export default async function AdminSettingsPage() {
  const gate = await gateStaff();
  if (gate.status === "denied") redirect("/dashboard");
  if (gate.status === "syncing") return <AccountSyncing />;

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl tracking-tight sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-muted-foreground">
          The achievement figures shown on the homepage.
        </p>
      </header>
      <SettingsForm />
    </div>
  );
}
