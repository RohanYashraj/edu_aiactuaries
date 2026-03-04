import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const dashboardNav = [
  { href: "/dashboard", label: "Overview" },
  { href: "/jobs/post", label: "Post a Job" },
  { href: "/account", label: "Account" },
] as const;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-primary-foreground/10 bg-primary text-primary-foreground">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-gold text-xs font-bold text-gold-foreground shadow-sm">
                edu.
              </span>
              <span className="hidden text-sm font-semibold tracking-tight sm:inline">
                SSS CoE
                <span className="ml-1 text-xs font-normal text-primary-foreground/60">
                  Dashboard
                </span>
              </span>
            </Link>
            <Separator
              orientation="vertical"
              className="hidden h-6 bg-primary-foreground/15 sm:block"
            />
            <nav className="hidden items-center gap-1 sm:flex">
              {dashboardNav.map(({ href, label }) => (
                <Link key={href} href={href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  >
                    {label}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                Back to Site
              </Button>
            </Link>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: { avatarBox: "size-8" },
              }}
            />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
