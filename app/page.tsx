import { auth } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { MousePointerClick, ArrowRight, Award, BookOpen, Briefcase, Sparkles, ArrowRightToLine, Keyboard } from "lucide-react";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const highlights = [
  {
    icon: Award,
    title: "Professional Certifications",
    description:
      "Industry-recognised programmes in actuarial data science and AI.",
  },
  {
    icon: BookOpen,
    title: "Hands-on Workshops",
    description:
      "Practical sessions bridging theory and real-world applications.",
  },
  {
    icon: Sparkles,
    title: "Powered by AI",
    description:
      "Cutting-edge curriculum designed for the age of artificial intelligence.",
  },
  {
    icon: Briefcase,
    title: "Career Opportunities",
    description:
      "Connect with top employers seeking actuarial and data science talent.",
  },
] as const;

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="hero-glow relative flex flex-col items-center justify-center overflow-hidden px-4 py-28 text-center sm:py-36">
          <div className="animate-fade-in-up mx-auto max-w-3xl">
            <Link
              href="https://aiactuaries.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Badge
                variant="outline"
                className="mb-6 border-gold/30 bg-gold-light/50 px-4 py-1.5 text-xs font-medium tracking-wider hover:border-gold/50 hover:bg-gold-light/70 transition-colors"
              >
                Powered by aiactuaries.org
              </Badge>
            </Link>
            <h1 className="font-display text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Sri Sathya Sai
              <span className="mt-1 block">Institute of Actuaries</span>
            </h1>
            <p className="mt-4 text-lg text-gold sm:text-xl">
              for Actuarial Data Science & AI
            </p>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              Pioneering the future of Actuarial Science through AI and Data
              Science. Building the next generation of actuarial professionals
              equipped for a data-driven world.
            </p>

            {userId ? (
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/certifications">
                  <Button
                    size="lg"
                    className="gap-2 shadow-md shadow-primary/20"
                  >
                    Explore Certifications
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="lg">
                    Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="https://forms.gle/u6sKYR3WVXpgGDGS7"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    className="gap-2 shadow-md shadow-primary/20"
                  >
                    Become a Member
                    <ArrowRightToLine className="size-4" />
                    <Keyboard className="size-4" />
                  </Button>
                </Link>
                <SignInButton mode="modal">
                  <Button variant="outline" size="lg">
                    Already have an account? Sign In
                  </Button>
                </SignInButton>
              </div>
            )}
          </div>
        </section>

        {/* Highlights */}
        <section className="border-t border-border bg-muted/40 px-4 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display mb-12 text-center text-2xl tracking-tight sm:text-3xl">
              Why Choose Us
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {highlights.map(({ icon: Icon, title, description }, i) => (
                <Card
                  key={title}
                  className="animate-fade-in-up border-transparent bg-background shadow-sm"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <CardHeader>
                    <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{title}</CardTitle>
                    <CardDescription className="leading-relaxed">
                      {description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Certification */}
        <section className="px-4 py-20 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display mb-2 text-2xl tracking-tight sm:text-3xl">
              Flagship Programme
            </h2>
            <p className="mb-8 text-muted-foreground">
              The certification that sets us apart.
            </p>
            <Card className="gradient-border border-0 bg-card p-[2px] text-left">
              <div className="rounded-[inherit] bg-card p-0">
                <CardHeader className="p-6 sm:p-8">
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-gold text-gold-foreground shadow-md shadow-gold/20">
                      <Award className="size-6" />
                    </div>
                    <div>
                      <Badge className="mb-1 bg-gold/15 text-gold hover:bg-gold/20">
                        Flagship
                      </Badge>
                      <CardTitle className="font-display text-xl sm:text-2xl">
                        AI Actuaries Certification
                      </CardTitle>
                    </div>
                  </div>
                  <CardDescription className="mt-4 text-base leading-relaxed">
                    Our premier certification blending actuarial science with
                    cutting-edge AI and machine learning. Designed for
                    professionals ready to lead the transformation of the
                    insurance and risk industry.
                  </CardDescription>
                </CardHeader>
              </div>
            </Card>
            <Link href="/certifications" className="mt-8 inline-block">
              <Button variant="outline" className="gap-2">
                View All Certifications
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* CTA */}
        {!userId && (
          <section className="relative overflow-hidden border-t border-border px-4 py-20 text-center sm:py-24">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-gold/5" />
            <div className="relative mx-auto max-w-xl">
              <h2 className="font-display text-2xl tracking-tight sm:text-3xl">
                Ready to Get Started?
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Apply for membership to be among the first to access world-class
                Actuarial Data Science & AI education.
              </p>
              <Link href="https://forms.gle/u6sKYR3WVXpgGDGS7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-block">
                <Button size="lg" className="gap-2 shadow-md shadow-primary/20">
                  Become a Member
                  <ArrowRightToLine className="size-4" />
                  <Keyboard className="size-4" />
                </Button>
              </Link>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
