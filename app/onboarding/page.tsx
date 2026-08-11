import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fetchQuery } from "convex/nextjs";

import { api } from "@/convex/_generated/api";
import { buildMetadata } from "@/lib/seo";
import { OnboardingForm } from "./_components/onboarding-form";

export const metadata = buildMetadata({
  title: "Complete your profile",
  path: "/onboarding",
  noindex: true,
});

export default async function OnboardingPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await fetchQuery(
    api.users.getCurrentUser,
    {},
    { token: (await getToken({ template: "convex" })) ?? undefined },
  );

  // Already onboarded — don't make people re-run the wizard.
  if (user?.onboardingCompletedAt) redirect("/dashboard");

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:py-20">
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-gold">
          Welcome to SSSIA
        </p>
        <h1 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">
          Complete your profile
        </h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          This helps us tailor programs, certifications, and opportunities to
          you. It takes about a minute, and you can edit everything later.
        </p>
      </header>

      <div className="mt-10">
        <OnboardingForm />
      </div>
    </div>
  );
}
