import { jsonLdDocument, type JsonLdNode } from "@/lib/jsonld";

/**
 * Emits a schema.org JSON-LD `@graph` into the document.
 *
 * Rendered from a server component so the structured data is present in the
 * initial HTML — retrieval crawlers (GPTBot, ClaudeBot, PerplexityBot) mostly
 * do not execute JavaScript.
 */
export function JsonLd({ nodes }: { nodes: (JsonLdNode | null | undefined)[] }) {
  const doc = jsonLdDocument(nodes);
  if (doc["@graph"].length === 0) return null;

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is escaped for the one character that can break
      // out of a <script> block.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(doc).replace(/</g, "\\u003c"),
      }}
    />
  );
}
