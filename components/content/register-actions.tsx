"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { Bookmark, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";

/**
 * Register / save controls for an event, programme or workshop.
 *
 * Registration is recorded in Convex rather than handed off to a form, so the
 * Institute knows who signed up. Where a programme still points at an external
 * registration URL, that link is shown alongside rather than replaced.
 */
export function RegisterActions({
  contentId,
  externalUrl,
  externalLabel = "Register externally",
}: {
  contentId: string;
  externalUrl?: string;
  externalLabel?: string;
}) {
  // Client-side on purpose: the detail pages are statically generated, so the
  // server cannot know the visitor. While Clerk is still loading, isSignedIn is
  // undefined and the signed-out call to action renders — matching the static
  // HTML, so there is no hydration mismatch and no spinner on the primary action.
  const { isSignedIn } = useAuth();
  const signedIn = isSignedIn === true;
  const id = contentId as Id<"content">;
  const status = useQuery(api.registrations.statusFor, { contentId: id });
  const register = useMutation(api.registrations.register);
  const cancel = useMutation(api.registrations.cancel);
  const toggleSaved = useMutation(api.registrations.toggleSaved);

  const [isPending, setIsPending] = useState(false);

  // Signed-out visitors never need the query result: the call to action is the
  // same either way, so render it immediately.
  if (!signedIn || status?.signedIn === false) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild size="lg" className="gap-2">
          <Link href="/sign-up">Become a member to register</Link>
        </Button>
        {externalUrl ? (
          <Button asChild variant="outline" size="lg">
            <a href={externalUrl} target="_blank" rel="noopener noreferrer">
              {externalLabel}
            </a>
          </Button>
        ) : null}
      </div>
    );
  }

  if (status === undefined) {
    return (
      <div className="flex h-11 items-center text-sm text-muted-foreground">
        <Loader2 className="mr-2 size-4 animate-spin" />
        Checking your registration
      </div>
    );
  }

  const resolved = status;

  async function handleRegister() {
    setIsPending(true);
    try {
      if (resolved.registered) {
        await cancel({ contentId: id });
        toast.success("Registration cancelled");
      } else {
        await register({ contentId: id });
        toast.success("You're registered");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        size="lg"
        variant={status.registered ? "outline" : "default"}
        className={
          status.registered
            ? "gap-2"
            : "gap-2 bg-gold text-gold-foreground shadow-sm hover:bg-gold/90"
        }
        disabled={isPending}
        onClick={handleRegister}
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : status.registered ? (
          <Check className="size-4" />
        ) : null}
        {status.registered ? "You're registered" : "Register"}
      </Button>

      <Button
        variant="ghost"
        size="lg"
        className="gap-2"
        onClick={async () => {
          const result = await toggleSaved({ contentId: id });
          toast.success(result.saved ? "Saved" : "Removed from saved");
        }}
      >
        <Bookmark
          className={status.saved ? "size-4 fill-current" : "size-4"}
        />
        {status.saved ? "Saved" : "Save"}
      </Button>

      {externalUrl ? (
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          {externalLabel}
        </a>
      ) : null}
    </div>
  );
}
