import { buildMetadata } from "@/lib/seo";
import { MediaLibrary } from "../_components/media-library";

export const metadata = buildMetadata({ title: "Media", noindex: true });

export default function AdminMediaPage() {
  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl tracking-tight sm:text-3xl">
          Media
        </h1>
        <p className="mt-1 text-muted-foreground">
          Uploaded images. Alt text here is what screen readers announce and
          what search engines index, so keep it descriptive.
        </p>
      </header>
      <MediaLibrary />
    </div>
  );
}
