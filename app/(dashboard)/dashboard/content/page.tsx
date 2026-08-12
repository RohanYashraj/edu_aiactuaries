import { redirect } from "next/navigation";

import { gateStaff } from "@/lib/dashboard-user";
import { buildMetadata } from "@/lib/seo";
import { AccountSyncing } from "../_components/account-syncing";
import { ContentTable } from "../_components/content-table";

export const metadata = buildMetadata({ title: "Content", noindex: true });

export default async function AdminContentPage() {
  const gate = await gateStaff();
  if (gate.status === "denied") redirect("/dashboard");
  if (gate.status === "syncing") return <AccountSyncing />;

  return <ContentTable />;
}
