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
  { href: "/", label: "Home" },
  { href: "/certifications", label: "Certifications" },
  { href: "/workshops", label: "Workshops" },
  { href: "/jobs", label: "Jobs" },
] as const;

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground shadow-sm">
            SS
          </span>
          <span className="hidden text-sm font-semibold tracking-tight sm:inline">
            SSS CoE
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              Actuarial DS & AI
            </span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label }) => {
            const isActive =
              href === "/"
                ? pathname === "/"
                : pathname.startsWith(href);

            return (
              <Link key={href} href={href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={isActive ? "font-semibold" : ""}
                >
                  {label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <SignedIn>
            <Link href="/dashboard" className="hidden md:inline-flex">
              <Button variant="outline" size="sm">
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
            <Link href="/waitlist" className="hidden sm:inline-flex">
              <Button variant="outline" size="sm">
                Join Waitlist
              </Button>
            </Link>
            <SignInButton mode="modal">
              <Button size="sm" className="shadow-sm shadow-primary/15">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>

          {/* Mobile hamburger */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
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
                {navLinks.map(({ href, label }) => {
                  const isActive =
                    href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(href);

                  return (
                    <SheetClose asChild key={href}>
                      <Link href={href}>
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
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
                      <Button variant="outline" className="w-full justify-start">
                        Dashboard
                      </Button>
                    </Link>
                  </SheetClose>
                </SignedIn>
                <SignedOut>
                  <SheetClose asChild>
                    <Link href="/waitlist">
                      <Button variant="outline" className="w-full justify-start">
                        Join Waitlist
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
