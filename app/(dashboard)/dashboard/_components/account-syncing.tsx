/**
 * Shown by staff-gated pages when `gateStaff`/`gateAdmin` report
 * `status: "syncing"` — a valid Clerk session but no Convex user row yet.
 * Copy matches the client-side equivalent in `dashboard-content.tsx` so the
 * Overview and every staff page agree on what this state means.
 */
export function AccountSyncing() {
  return (
    <div className="py-16 text-center">
      <p className="text-muted-foreground">
        Setting up your account. Reload in a few seconds.
      </p>
    </div>
  );
}
