import { buildMetadata } from "@/lib/seo";
import { JobsModeration } from "../_components/jobs-moderation";

export const metadata = buildMetadata({ title: "Jobs", noindex: true });

export default function AdminJobsPage() {
  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl tracking-tight sm:text-3xl">
          Jobs
        </h1>
        <p className="mt-1 text-muted-foreground">
          Listings posted by employers. Published listings appear on the public
          jobs board and are indexed as JobPosting entries.
        </p>
      </header>
      <JobsModeration />
    </div>
  );
}
