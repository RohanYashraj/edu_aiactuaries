import { ConvexHttpClient } from "convex/browser";
import type {
  ArgsAndOptions,
  FunctionReference,
  FunctionReturnType,
} from "convex/server";

/**
 * Server-side Convex query, safe inside statically generated routes.
 *
 * Not `fetchQuery` from convex/nextjs: that helper hardcodes
 * `cache: "no-store"` on its fetch, which is a dynamic API — inside a route
 * with `revalidate` + `generateStaticParams` it throws DYNAMIC_SERVER_USAGE
 * whenever a page is rendered on demand (any newly created slug, any ISR
 * regeneration), which surfaced as 500s on every content detail page. A plain
 * fetch runs at build/regeneration time instead, which is exactly what ISR
 * wants.
 */
export async function fetchQuery<Query extends FunctionReference<"query">>(
  query: Query,
  ...argsAndOptions: ArgsAndOptions<Query, { token?: string }>
): Promise<FunctionReturnType<Query>> {
  const [args, options] = argsAndOptions;
  const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  if (options?.token) client.setAuth(options.token);
  return client.query(query, args ?? {});
}

/**
 * Revalidation windows for server-rendered marketing pages.
 *
 * These pages used to render their content client-side via useQuery, which
 * meant crawlers that don't execute JavaScript — most AI retrieval bots — saw
 * only a loading spinner. Fetching on the server puts the content in the
 * initial HTML; ISR keeps it cheap.
 */
export const LIST_REVALIDATE = 300; // 5 minutes
export const DETAIL_REVALIDATE = 3600; // 1 hour
