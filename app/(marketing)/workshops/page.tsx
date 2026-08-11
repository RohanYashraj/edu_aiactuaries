import { api } from "@/convex/_generated/api";
import { EmptyState, SectionHeader } from "@/components/marketing";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { fetchQuery } from "@/lib/convex-server";
import { WorkshopsTabs, type WorkshopItem } from "./_components/workshops-tabs";

export const metadata = buildMetadata({
  title: "Workshops",
  description:
    "Hands-on workshops in actuarial data science, AI, and risk analytics.",
  path: "/workshops",
});

// Next requires a literal here; it can't statically read an imported constant.
export const revalidate = 300; // 5 minutes

export default async function WorkshopsPage() {
  const docs = await fetchQuery(api.content.listByTypeChronological, {
    type: "workshop",
  });

  // Lift `lifecycle` out of the details union so the client tab component
  // doesn't need to narrow it.
  const workshops: WorkshopItem[] = docs.map((doc) => ({
    ...doc,
    lifecycle:
      doc.details.kind === "workshop" ? doc.details.lifecycle : "upcoming",
  }));

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <JsonLd
        nodes={[breadcrumbSchema([{ label: "Workshops", href: "/workshops" }])]}
      />
      <SectionHeader
        as="h1"
        title="Workshops"
        description="Practical, hands-on workshops at the intersection of Actuarial Science and AI."
      />

      {workshops.length === 0 ? (
        <EmptyState
          title="No workshops published"
          description="Upcoming workshops will be listed here as dates are confirmed."
        />
      ) : (
        <WorkshopsTabs workshops={workshops} />
      )}
    </section>
  );
}
