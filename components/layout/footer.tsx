import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t border-primary/10 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:justify-between">
          <div>
            <p className="font-display text-lg">
              Sri Sathya Sai Institute of Actuaries
            </p>
            <p className="mt-0.5 text-sm text-primary-foreground/70">
              Actuarial Data Science & AI
            </p>
          </div>
          <p className="text-sm text-primary-foreground/70 text-left sm:text-right">
            &copy; {new Date().getFullYear()} sssia.org. All rights reserved.
          </p>
        </div>
        <Separator className="mt-8 bg-primary-foreground/10" />
      </div>
    </footer>
  );
}
