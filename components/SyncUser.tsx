"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function SyncUser() {
  const { isSignedIn, user } = useUser();
  const syncUser = useMutation(api.users.syncCurrentUser);
  const lastSyncedId = useRef<string | null>(null);

  useEffect(() => {
    if (!isSignedIn || !user) return;
    if (lastSyncedId.current === user.id) return;

    syncUser()
      .then(() => {
        lastSyncedId.current = user.id;
      })
      .catch((err) => {
        console.error("User sync failed:", err);
      });
  }, [isSignedIn, user, syncUser]);

  return null;
}
