import { notFound, redirect } from "next/navigation";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { fetchQuery } from "@/lib/convex-server";
import { gateStaff } from "@/lib/dashboard-user";
import { buildMetadata } from "@/lib/seo";
import { AccountSyncing } from "../../_components/account-syncing";
import { ContentEditor } from "../../_components/content-editor";

export const metadata = buildMetadata({ title: "Edit content", noindex: true });

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gate = await gateStaff();
  if (gate.status === "denied") redirect("/dashboard");
  if (gate.status === "syncing") return <AccountSyncing />;

  // contentAdmin.getById is role-gated in Convex, so the request needs the
  // caller's token — the check above has already established they're allowed here.
  // Reuse the token resolved by gateStaff rather than re-minting one.
  const doc = await fetchQuery(
    api.contentAdmin.getById,
    { id: id as Id<"content"> },
    { token: gate.token },
  );

  if (!doc) notFound();

  const { coverImageUrl, ...rest } = doc;
  return <ContentEditor doc={rest} coverImageUrl={coverImageUrl} />;
}
