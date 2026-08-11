import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { NextRequest } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    const eventType = evt.type;

    if (eventType === "user.created" || eventType === "user.updated") {
      const {
        id,
        email_addresses,
        username,
        first_name,
        last_name,
        image_url,
        public_metadata,
      } = evt.data;

      const email = email_addresses?.[0]?.email_address ?? "";
      const name = [first_name, last_name].filter(Boolean).join(" ") || "User";

      await convex.mutation(api.users.upsertFromClerk, {
        clerkId: id,
        email,
        username: username ?? undefined,
        name,
        imageUrl: image_url ?? undefined,
        // Only used when the user is first created. Convex owns the role from
        // then on — the mutation ignores this field on update so a profile
        // edit can't demote an admin.
        role:
          eventType === "user.created"
            ? ((public_metadata?.role as
                | "member"
                | "employer"
                | "content_manager"
                | "admin"
                | undefined) ?? "member")
            : undefined,
      });
    }

    if (eventType === "user.deleted") {
      const { id } = evt.data;
      if (id) {
        await convex.mutation(api.users.deleteByClerkId, { clerkId: id });
      }
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response("Webhook verification failed", { status: 400 });
  }
}
