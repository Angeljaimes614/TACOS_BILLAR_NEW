/**
 * Renderiza un objeto JSON-LD como `<script type="application/ld+json">`.
 * Server-only (imprime literal, sin client JS).
 */
export function JsonLd({ data, id }: { data: object; id?: string }) {
  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
