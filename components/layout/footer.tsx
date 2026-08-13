import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import { siteName, siteTagline } from "@/lib/site";

/**
 * Secondary wayfinding. The top nav is down to four items, so the footer
 * carries the fuller map — including pages that don't earn a nav slot.
 */
const COLUMNS = [
  {
    heading: "Learn",
    links: [
      { href: "/programs", label: "Programs" },
      { href: "/programs#certifications-heading", label: "Certifications" },
      { href: "/programs#workshops-heading", label: "Workshops" },
    ],
  },
  {
    heading: "Institute",
    links: [
      { href: "/about", label: "About" },
      { href: "/events", label: "Events" },
      { href: "/news", label: "News" },
    ],
  },
  {
    heading: "Members",
    links: [
      { href: "/sign-up", label: "Become a member" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/faq", label: "FAQ" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-primary/10 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <img src="/sssia-logo.jpeg" alt="SSSIA Logo" className="h-12 w-auto" />
            <p className="mt-4 text-sm text-primary-foreground/70">
              {siteTagline}
            </p>
            <a
              href="https://aiactuaries.org"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm text-primary-foreground/70 underline-offset-4 hover:text-primary-foreground hover:underline"
            >
              Powered by aiactuaries.org
            </a>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.heading} aria-labelledby={`footer-${column.heading}`}>
              <h2
                id={`footer-${column.heading}`}
                className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-primary-foreground/50"
              >
                {column.heading}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary-foreground/80 underline-offset-4 transition-colors hover:text-primary-foreground hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <Separator className="mt-12 bg-primary-foreground/10" />

        <p className="mt-6 text-sm text-primary-foreground/60">
          &copy; {new Date().getFullYear()} sssia.org. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
