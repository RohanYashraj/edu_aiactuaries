"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const navLinks = [
  {
    href: "https://aiactuaries.org/our-board",
    label: "Our Board",
    external: true,
  },
  { href: "/certifications", label: "Certifications", external: false },
  { href: "/workshops", label: "Workshops", external: false },
  { href: "/events", label: "Events", external: false },
  { href: "/jobs", label: "Jobs", external: false },
  { href: "/news", label: "News", external: false },
] as const;

export function Header() {
  const pathname = usePathname();

  /** External links are absolute URLs and can never match a pathname. */
  const isActive = (href: string, external: boolean) =>
    !external && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header className="sticky top-0 z-50 border-b border-primary-foreground/10 bg-primary text-primary-foreground">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo (links to home) */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-gold text-xs font-bold text-gold-foreground shadow-sm">
              edu.
            </span>
          </Link>
        </div>

        {/* Right-aligned navigation + auth */}
        <div className="flex items-center gap-3">
          {/* Desktop navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map(({ href, label, external }) => {
              const active = isActive(href, external);

              return (
                <Link
                  key={href}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className={
                      active
                        ? "bg-primary-foreground/15 font-semibold text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
                        : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                    }
                  >
                    {label}
                  </Button>
                </Link>
              );
            })}
          </nav>
          <SignedIn>
            <Link href="/dashboard" className="hidden md:inline-flex">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                Dashboard
              </Button>
            </Link>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: { avatarBox: "size-8" },
              }}
            />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <Button
                variant="ghost"
                size="sm"
                className="hidden text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground sm:inline-flex"
              >
                Sign In
              </Button>
            </SignInButton>
            <Link href="/sign-up">
              <Button
                size="sm"
                className="bg-gold text-gold-foreground shadow-sm hover:bg-gold/90"
              >
                Become a Member
              </Button>
            </Link>
          </SignedOut>

          {/* Mobile hamburger */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Menu className="size-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="font-display">Navigation</SheetTitle>
              </SheetHeader>
              <Separator />
              <nav className="flex flex-col gap-1 px-4">
                {navLinks.map(({ href, label, external }) => {
                  const active = isActive(href, external);

                  return (
                    <SheetClose asChild key={href}>
                      <Link
                        href={href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                      >
                        <Button
                          variant={active ? "secondary" : "ghost"}
                          className="w-full justify-start"
                        >
                          {label}
                        </Button>
                      </Link>
                    </SheetClose>
                  );
                })}
                <Separator className="my-2" />
                <SignedIn>
                  <SheetClose asChild>
                    <Link href="/dashboard">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        Dashboard
                      </Button>
                    </Link>
                  </SheetClose>
                </SignedIn>
                <SignedOut>
                  <SheetClose asChild>
                    <Link href="/sign-up">
                      <Button className="w-full justify-start bg-gold text-gold-foreground hover:bg-gold/90">
                        Become a Member
                      </Button>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/sign-in">
                      <Button variant="outline" className="w-full justify-start">
                        Sign In
                      </Button>
                    </Link>
                  </SheetClose>
                </SignedOut>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
