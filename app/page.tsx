import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HomeClient } from "@/components/marketing/home-client";
import { fetchQuery } from "@/lib/convex-server";
import { contentHref } from "@/lib/content";

// Next requires a literal here; it can't statically read an imported constant.
export const revalidate = 300; // 5 minutes

export default async function Home() {
  // No auth() here: this page is statically regenerated (revalidate above), so
  // request-bound APIs would throw DYNAMIC_SERVER_USAGE during ISR. The hero's
  // signed-in variant is resolved client-side in HomeClient.
  const [featured, certifications, settings, organizations, programs, events, internships] =
    await Promise.all([
    fetchQuery(api.content.listFeatured, {}),
    fetchQuery(api.content.listByType, { type: "certification", limit: 4 }),
    fetchQuery(api.settings.get, {}),
    fetchQuery(api.organizations.listFeatured, {}),
    fetchQuery(api.content.listByType, { type: "program" }),
    fetchQuery(api.content.listByType, { type: "event" }),
    fetchQuery(api.content.listByType, { type: "internship" }),
  ]);

  // Programs and events are the things a reader can still act on; news is
  // evidence that the Institute is active. They earn different treatments.
  const upcoming = featured.filter(
    (item) => item.type === "program" || item.type === "event",
  );
  const recent = featured.filter((item) => item.type === "news").slice(0, 5);

  const flagship = certifications.find((c) => c.featured) ?? certifications[0];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <HomeClient
          news={recent}
          settings={settings} 
          carouselItems={[...programs, ...events, ...internships]} 
        />
      </main>

      <Footer />
    </div>
  );
}
