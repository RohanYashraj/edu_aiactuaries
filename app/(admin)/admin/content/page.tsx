import { buildMetadata } from "@/lib/seo";
import { ContentTable } from "../_components/content-table";

export const metadata = buildMetadata({ title: "Content", noindex: true });

export default function AdminContentPage() {
  return <ContentTable />;
}
