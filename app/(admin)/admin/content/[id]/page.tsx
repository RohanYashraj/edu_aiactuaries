import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { fetchQuery } from "@/lib/convex-server";
import { buildMetadata } from "@/lib/seo";
import { ContentEditor } from "../../_components/content-editor";

export const metadata = buildMetadata({ title: "Edit content", noindex: true });

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { getToken } = await auth();

  // contentAdmin.getById is role-gated in Convex, so the request needs the
  // caller's token — the layout has already established they're allowed here.
  const doc = await fetchQuery(
    api.contentAdmin.getById,
    { id: id as Id<"content"> },
    { token: (await getToken({ template: "convex" })) ?? undefined },
  );

  if (!doc) notFound();

  const { coverImageUrl, ...rest } = doc;
  return <ContentEditor doc={rest} coverImageUrl={coverImageUrl} />;
}
