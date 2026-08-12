import { redirect } from "next/navigation";

import { getDashboardSession, isStaff } from "@/lib/dashboard-user";
import { buildMetadata } from "@/lib/seo";
import { ContentEditor } from "../../_components/content-editor";

export const metadata = buildMetadata({ title: "New content", noindex: true });

export default async function NewContentPage() {
  const { user } = await getDashboardSession();
  if (!isStaff(user)) redirect("/dashboard");

  return <ContentEditor />;
}
