import { redirect } from "next/navigation";

import { getDashboardSession, isStaff } from "@/lib/dashboard-user";
import { buildMetadata } from "@/lib/seo";
import { MediaLibrary } from "../_components/media-library";

export const metadata = buildMetadata({ title: "Media", noindex: true });

export default async function AdminMediaPage() {
  const { user } = await getDashboardSession();
  if (!isStaff(user)) redirect("/dashboard");

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
