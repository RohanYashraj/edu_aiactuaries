import { redirect } from "next/navigation";

import { gateStaff } from "@/lib/dashboard-user";
import { buildMetadata } from "@/lib/seo";
import { AccountSyncing } from "../../_components/account-syncing";
import { ContentEditor } from "../../_components/content-editor";

export const metadata = buildMetadata({ title: "New content", noindex: true });

export default async function NewContentPage() {
  const gate = await gateStaff();
  if (gate.status === "denied") redirect("/dashboard");
  if (gate.status === "syncing") return <AccountSyncing />;

  return <ContentEditor />;
}
