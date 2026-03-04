import { auth } from "@clerk/nextjs/server";
import { SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <span className="text-sm font-semibold tracking-tight">
            SSS CoE — Actuarial DS &amp; AI
          </span>
          <div className="flex items-center gap-3">
            {userId ? (
              <UserButton />
            ) : (
              <>
                <Link
                  href="/waitlist"
                  className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
                >
                  Join Waitlist
                </Link>
                <SignInButton mode="modal">
                  <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                    Sign In
                  </button>
                </SignInButton>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Sri Sathya Sai Center of Excellence
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            in Actuarial Data Science &amp; AI
          </p>
          <p className="mt-6 text-muted-foreground">
            Pioneering the future of Actuarial Science through AI and Data
            Science.
          </p>

          {userId ? (
            <div className="mt-8 rounded-lg border border-border bg-card p-6">
              <p className="text-lg font-medium">Welcome back!</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Your dashboard and full features are coming soon.
              </p>
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/waitlist"
                className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Join the Waitlist
              </Link>
              <SignInButton mode="modal">
                <button className="rounded-md border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-accent">
                  Already have an account? Sign In
                </button>
              </SignInButton>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Sri Sathya Sai Center of Excellence
        in Actuarial Data Science &amp; AI
      </footer>
    </div>
  );
}
