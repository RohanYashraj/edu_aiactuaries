import { auth } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Award, ArrowRightToLine, Keyboard, Calendar } from "lucide-react";

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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const recentHighlights = [
  {
    title: "Leadership Meeting and Partner Lunch",
    content:
      "Society of Actuaries leadership meeting followed by a partner lunch at Hotel Sheraton, Bangalore.",
    date: "Bangalore",
    organization: {
      logoSrc: "/soa.png",
      logoAlt: "Society of Actuaries",
      name: "Society of Actuaries",
      logoText: "SOA",
    },
  },
  {
    title: "Global Conference of Actuaries",
    content:
      "Participation in the Global Conference of Actuaries by the Institute of Actuaries of India at Jio World Convention Centre, Mumbai.",
    date: "Mumbai",
    organization: {
      logoSrc: "/iai.png",
      logoAlt: "Institute of Actuaries of India",
      name: "IAI",
      logoText: "IAI",
    },
  },
  {
    title: "International Leadership Meeting and Partner Dinner",
    content:
      "Casualty Actuarial Society international leadership meeting with an evening partner dinner in Mumbai.",
    date: "Mumbai",
    organization: {
      logoSrc: "/cas.png",
      logoAlt: "Casualty Actuarial Society",
      name: "CAS",
      logoText: "CAS",
    },
  },
  {
    title: "Industry-Academia Meet",
    content:
      "Institute and Faculty of Actuaries industry-academia engagement hosted at Christ University, Bangalore.",
    date: "Bangalore",
    organization: {
      name: "IFoA",
      logoSrc: "/ifoa.svg",
      logoAlt: "IFoA",
      logoClassName: "dark:invert",
    },
  },
  {
    title: "ACTEX Learning Meeting",
    content:
      "Meeting with ACTEX Learning to discuss actuarial education pathways and collaborative learning opportunities in Bangalore.",
    date: "Bangalore",
    organization: {
      logoSrc: "/actex.png",
      logoAlt: "ACTEX Learning",
      name: "ACTEX Learning",
      logoText: "AX",
    },
  },
  {
    title: "Webinar on AI Applications in Actuarial Science",
    content:
      "Delivered a webinar focused on practical AI applications in actuarial science for participants online and in Puttaparthi.",
    date: "Online and Puttaparthi",
    organization: {
      logoSrc: "/aiactuaries.png",
      logoAlt: "AIActuaries",
      name: "AIActuaries",
      logoText: "AIActuaries",
    },
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

        {/* Upcoming Event */}
        <section className="border-t border-border bg-muted/40 px-4 py-20 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display mb-2 text-2xl tracking-tight sm:text-3xl">
              Upcoming Program
            </h2>
            <p className="mb-8 text-muted-foreground">
              Registrations are now open for our summer course.
            </p>
            <Card className="gradient-border border-0 bg-card p-[2px] text-left">
              <div className="rounded-[inherit] bg-card p-0">
                <CardHeader className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gold text-gold-foreground shadow-md shadow-gold/20">
                        <Calendar className="size-6" />
                      </div>
                      <div>
                        <Badge className="mb-2 bg-gold/15 text-gold hover:bg-gold/20">
                          Registrations Open
                        </Badge>
                        <CardTitle className="font-display text-xl sm:text-2xl">
                          Summer Course in Actuarial Data Science – 2026
                        </CardTitle>
                      </div>
                    </div>
                    {/* Knowledge Partner Logo Placeholder */}
                    <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
                      <span className="font-semibold uppercase tracking-wider text-muted-foreground">
                        Knowledge Partner
                      </span>
                      <div className="flex h-16 w-40 items-center justify-start sm:justify-end bg-transparent p-0">
                        <Image src="/ifoa.svg" alt="Knowledge Partner Logo" width={150} height={50} className="h-full w-auto object-contain dark:invert" />
                      </div>
                    </div>
                  </div>
                  <CardDescription className="mt-4 text-base leading-relaxed">
                    Join the third edition of our 3-week program to build a strong foundation in actuarial data science. Delivered by experienced faculty and industry practitioners. Offered free of charge.
                  </CardDescription>
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <Link 
                      href="https://lnkd.in/gsewFfW7"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="w-full sm:w-auto gap-2">
                        Register Now
                        <ArrowRightToLine className="size-4" />
                      </Button>
                    </Link>
                    <Link href="/events/summer-program-2026">
                      <Button variant="outline" className="w-full sm:w-auto gap-2">
                        View Details
                        <ArrowRight className="size-4" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
              </div>
            </Card>
          </div>
        </section>

        {/* Recent Highlights */}
        <section className="border-t border-border px-4 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display mb-12 text-center text-2xl tracking-tight sm:text-3xl">
              Recent Highlights
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-muted-foreground sm:text-base">
              Recent conversations and collaboration checkpoints with partner organizations.
            </p>
            <Carousel
              className="w-full"
              opts={{ loop: true, align: "start" }}
            >
              <div className="mb-3 flex items-center justify-end gap-1 md:hidden">
                <CarouselPrevious className="static translate-y-0" />
                <CarouselNext className="static translate-y-0" />
              </div>
              <div className="hidden justify-end gap-2 md:mb-4 md:flex">
                <CarouselPrevious className="static translate-y-0" />
                <CarouselNext className="static translate-y-0" />
              </div>
              <CarouselContent>
                {recentHighlights.map((highlight, i) => (
                  <CarouselItem
                    key={`${highlight.title}-${highlight.date}`}
                    className="basis-full md:basis-1/2 lg:basis-1/3"
                  >
                    <Card
                      className="animate-fade-in-up h-full border-border/70 bg-background"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <CardHeader className="flex h-full flex-col space-y-3">
                        <CardTitle className="text-sm font-semibold sm:text-base">
                          {highlight.title}
                        </CardTitle>
                        <CardDescription className="text-xs leading-relaxed sm:text-sm">
                          {highlight.content}
                        </CardDescription>
                        <div className="mt-auto grid grid-cols-2 items-end gap-3 pt-2">
                          <div className="space-y-0.5">
                            <p className="text-xs text-muted-foreground">{highlight.date}</p>
                            <p className="text-xs font-medium text-muted-foreground">
                              with {highlight.organization.name}
                            </p>
                          </div>
                          <div className="flex justify-start">
                            <Image
                              src={highlight.organization.logoSrc}
                              alt={highlight.organization.logoAlt}
                              width={250}
                              height={50}
                              className="max-h-[60px] w-auto"
                            />
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </section>

        {/* Featured Certification */}
        <section className="border-t border-border bg-muted/40 px-4 py-20 sm:py-24">
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
