import { auth } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, Award, BookOpen, Briefcase, Sparkles } from "lucide-react";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
        <section className="flex flex-col items-center justify-center px-4 py-24 text-center sm:py-32">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Sri Sathya Sai Center of Excellence
            </h1>
            <p className="mt-3 text-lg text-muted-foreground sm:text-xl">
              in Actuarial Data Science & AI
            </p>
            <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
              Pioneering the future of Actuarial Science through AI and Data
              Science. Building the next generation of actuarial professionals.
            </p>

            {userId ? (
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/certifications">
                  <Button size="lg" className="gap-2">
                    Explore Certifications
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="lg">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/waitlist">
                  <Button size="lg" className="gap-2">
                    Join the Waitlist
                    <ArrowRight className="size-4" />
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
        <section className="border-t border-border bg-muted/30 px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-10 text-center text-2xl font-bold tracking-tight sm:text-3xl">
              Why Choose Us
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {highlights.map(({ icon: Icon, title, description }) => (
                <Card key={title} className="border-transparent bg-background">
                  <CardHeader>
                    <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Certification */}
        <section className="px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Flagship Programme
            </h2>
            <Card className="border-2 border-primary/20 bg-linear-to-br from-primary/5 to-transparent text-left">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Award className="size-5" />
                  </div>
                  <CardTitle className="text-xl">
                    AI Actuaries Certification
                  </CardTitle>
                </div>
                <CardDescription className="mt-3 text-base">
                  Our premier certification blending actuarial science with
                  cutting-edge AI and machine learning. Designed for
                  professionals ready to lead the transformation of the
                  insurance and risk industry.
                </CardDescription>
              </CardHeader>
            </Card>
            <Link href="/certifications" className="mt-6 inline-block">
              <Button variant="outline" className="gap-2">
                View All Certifications
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* CTA */}
        {!userId && (
          <section className="border-t border-border bg-muted/30 px-4 py-16 text-center sm:py-20">
            <div className="mx-auto max-w-xl">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Ready to Get Started?
              </h2>
              <p className="mt-3 text-muted-foreground">
                Join our waitlist to be among the first to access world-class
                actuarial data science education.
              </p>
              <Link href="/waitlist" className="mt-8 inline-block">
                <Button size="lg" className="gap-2">
                  Join the Waitlist
                  <ArrowRight className="size-4" />
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
