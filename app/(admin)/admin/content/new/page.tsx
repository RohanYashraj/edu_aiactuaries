import { buildMetadata } from "@/lib/seo";
import { ContentEditor } from "../../_components/content-editor";

export const metadata = buildMetadata({ title: "New content", noindex: true });

export default function NewContentPage() {
  return <ContentEditor />;
}
