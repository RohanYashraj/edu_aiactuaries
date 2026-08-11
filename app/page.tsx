import { auth } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EventsShowcase } from "@/components/marketing/events-showcase";
import { AchievementsBand } from "@/components/marketing/achievements-band";
import { FaqSection } from "@/components/content/faq-section";
import { JsonLd } from "@/components/seo/json-ld";
import { faqSchema } from "@/lib/jsonld";
import { SITE_FAQS } from "@/lib/site-faqs";
import { fetchQuery } from "@/lib/convex-server";
import { contentHref } from "@/lib/content";

// Next requires a literal here; it can't statically read an imported constant.
export const revalidate = 300; // 5 minutes

export default async function Home() {
  const [{ userId }, featured, certifications, settings] = await Promise.all([
    auth(),
    fetchQuery(api.content.listFeatured, {}),
    fetchQuery(api.content.listByType, { type: "certification", limit: 4 }),
    fetchQuery(api.settings.get, {}),
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
      <JsonLd nodes={[faqSchema([...SITE_FAQS])]} />
      <Header />

      <main className="flex-1">
        {/* ---------------------------------------------------------------- */}
        {/* Hero                                                              */}
        {/* ---------------------------------------------------------------- */}
        <section className="hero-glow relative flex flex-col items-center justify-center overflow-hidden px-4 py-24 text-center sm:py-32">
          <div className="animate-fade-in-up mx-auto max-w-3xl">
            <Badge
              variant="outline"
              className="border-gold/30 bg-gold-light/50 px-4 py-1.5 text-xs tracking-wider"
              asChild
            >
              <a
                href="https://aiactuaries.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Powered by aiactuaries.org
              </a>
            </Badge>

            <h1 className="mt-6 font-display text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Sri Sathya Sai
              <span className="mt-1 block">Institute of Actuaries</span>
            </h1>

            <p className="mt-4 text-lg text-gold sm:text-xl">
              for Actuarial Data Science &amp; AI
            </p>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              We teach actuarial science alongside the data science and AI the
              profession now runs on — to students across India, and largely
              free of charge.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              {userId ? (
                <>
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/programs">
                      Explore programs
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    size="lg"
                    className="gap-2 shadow-md shadow-primary/20"
                  >
                    <Link href="/sign-up">
                      Become a member
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <SignInButton mode="modal">
                    <Button variant="outline" size="lg">
                      Already have an account? Sign in
                    </Button>
                  </SignInButton>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        <AchievementsBand
          achievements={settings.achievements}
          intro={settings.achievementsIntro}
        />

        {/* ---------------------------------------------------------------- */}
        <EventsShowcase upcoming={upcoming} recent={recent} />

        {/* ---------------------------------------------------------------- */}
        {/* Flagship certification.                                          */}
        {/* ---------------------------------------------------------------- */}
        {flagship ? (
          <section className="border-t border-border px-4 py-20 sm:px-6 sm:py-24">
            <div className="mx-auto max-w-3xl">
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                Flagship programme
              </p>
              <h2 className="mt-4 font-display text-2xl leading-snug tracking-tight sm:text-3xl">
                <Link
                  href={contentHref("certification", flagship.slug)}
                  className="transition-colors hover:text-gold"
                >
                  {flagship.title}
                </Link>
              </h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
                {flagship.summary}
              </p>
              <div className="mt-6">
                <Button asChild variant="outline" className="gap-2">
                  <Link href={contentHref("certification", flagship.slug)}>
                    Learn more
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        ) : null}

        {/* ---------------------------------------------------------------- */}
        <section className="border-t border-border bg-muted/40 px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl">
            <FaqSection faqs={[...SITE_FAQS]} title="Questions, answered" />
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {!userId && (
          <section className="relative overflow-hidden border-t border-border px-4 py-20 sm:px-6 sm:py-24">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-gold/5" />
            <div className="relative mx-auto max-w-2xl text-center">
              <h2 className="font-display text-2xl tracking-tight sm:text-3xl">
                Membership is free
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Sign up to access certifications, workshops and events. It takes
                about a minute.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-8 gap-2 shadow-md shadow-primary/20"
              >
                <Link href="/sign-up">
                  Become a member
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
