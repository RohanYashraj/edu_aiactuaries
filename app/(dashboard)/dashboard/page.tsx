import { buildMetadata } from "@/lib/seo";
import { getDashboardSession, isStaff } from "@/lib/dashboard-user";
import { AdminOverview } from "./_components/admin-overview";
import { DashboardContent } from "./_components/dashboard-content";

export const metadata = buildMetadata({
  title: "Dashboard",
  path: "/dashboard",
  noindex: true,
});

export default async function DashboardPage() {
  const { user } = await getDashboardSession();

  return (
    <div className="space-y-10">
      {/* Staff get a working layer above their personal sections — they keep the
          member view rather than trading it for a CMS view. */}
      {isStaff(user) ? <AdminOverview /> : null}
      <DashboardContent />
    </div>
  );
}
