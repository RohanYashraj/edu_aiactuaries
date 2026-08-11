import { SignUp } from "@clerk/nextjs";

import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Become a Member",
  description:
    "Join the Sri Sathya Sai Institute of Actuaries. Membership is free and gives you access to certifications, workshops, events, and the jobs board.",
  path: "/sign-up",
  noindex: true,
});

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-16">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
          Become a Member
        </h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Membership is free. Create an account to access certifications,
          workshops, events, and the jobs board.
        </p>
      </div>
      <SignUp />
    </div>
  );
}
