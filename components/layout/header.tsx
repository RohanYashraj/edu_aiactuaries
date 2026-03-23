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
  { href: "https://aiactuaries.org/our-board", label: "Our Board" },
  { href: "/certifications", label: "Certifications" },
  { href: "/workshops", label: "Workshops" },
  { href: "/jobs", label: "Jobs" },
] as const;

export function Header() {
  const pathname = usePathname();

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
            {navLinks.map(({ href, label }) => {
              const isActive = pathname.startsWith(href);

              return (
                <Link key={href} href={href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={
                      isActive
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
                size="sm"
                className="bg-gold text-gold-foreground shadow-sm hover:bg-gold/90"
              >
                Sign In
              </Button>
            </SignInButton>
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
                {navLinks.map(({ href, label }) => {
                  const isActive = pathname.startsWith(href);

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
                    <Link href="/waitlist">
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2 "
                      >
                        Apply
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
