import { notFound, redirect } from "next/navigation";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { fetchQuery } from "@/lib/convex-server";
import { getDashboardSession, isStaff } from "@/lib/dashboard-user";
import { buildMetadata } from "@/lib/seo";
import { ContentEditor } from "../../_components/content-editor";

export const metadata = buildMetadata({ title: "Edit content", noindex: true });

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { token, user } = await getDashboardSession();
  if (!isStaff(user)) redirect("/dashboard");

  // contentAdmin.getById is role-gated in Convex, so the request needs the
  // caller's token — the check above has already established they're allowed here.
  const doc = await fetchQuery(
    api.contentAdmin.getById,
    { id: id as Id<"content"> },
    { token: token ?? undefined },
  );

  if (!doc) notFound();

  const { coverImageUrl, ...rest } = doc;
  return <ContentEditor doc={rest} coverImageUrl={coverImageUrl} />;
}
