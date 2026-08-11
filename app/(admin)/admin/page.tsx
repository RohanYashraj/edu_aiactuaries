import { buildMetadata } from "@/lib/seo";
import { AdminOverview } from "./_components/admin-overview";

export const metadata = buildMetadata({ title: "Admin", noindex: true });

export default function AdminPage() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-2xl tracking-tight sm:text-3xl">
          Overview
        </h1>
        <p className="mt-1 text-muted-foreground">
          What&apos;s live, what&apos;s in draft, and what changed recently.
        </p>
      </header>
      <AdminOverview />
    </div>
  );
}
