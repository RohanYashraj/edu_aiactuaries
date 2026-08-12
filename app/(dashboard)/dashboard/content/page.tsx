import { redirect } from "next/navigation";

import { getDashboardSession, isStaff } from "@/lib/dashboard-user";
import { buildMetadata } from "@/lib/seo";
import { ContentTable } from "../_components/content-table";

export const metadata = buildMetadata({ title: "Content", noindex: true });

export default async function AdminContentPage() {
  const { user } = await getDashboardSession();
  if (!isStaff(user)) redirect("/dashboard");

  return <ContentTable />;
}
