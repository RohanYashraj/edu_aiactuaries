import { buildMetadata } from "@/lib/seo";
import { ProfileForm } from "./_components/profile-form";

export const metadata = buildMetadata({
  title: "Profile",
  path: "/dashboard/profile",
  noindex: true,
});

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-8">
        <h1 className="font-display text-2xl tracking-tight sm:text-3xl">
          Your Profile
        </h1>
        <p className="mt-1 text-muted-foreground">
          Keep this current so we can point the right programs and opportunities
          your way.
        </p>
      </header>
      <ProfileForm />
    </div>
  );
}
