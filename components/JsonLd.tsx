/**
 * Emits one JSON-LD document per page as a single @graph.
 *
 * A graph beats a bare array of nodes: the @context is stated once and nodes
 * can reference each other (and the site-wide business) by @id instead of
 * repeating their contents.
 */
export default function JsonLd({ graph }: { graph: object[] }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
      }}
    />
  );
}
