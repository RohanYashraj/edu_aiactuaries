import Link from "next/link";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-24">
        <div className="mx-auto max-w-md text-center">
          <p className="font-display text-6xl text-gold">404</p>
          <h1 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">
            Page not found
          </h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            The page you are looking for doesn&apos;t exist or has moved.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild>
              <Link href="/">Back to home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/events">Browse events</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
