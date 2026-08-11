import { fetchQuery } from "convex/nextjs";

export { fetchQuery };

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
