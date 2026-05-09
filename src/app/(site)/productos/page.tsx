import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ProductCard } from "@/components/ui/product-card";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  allCategoriesQuery,
  allProductsQuery,
  productsByCategoryQuery,
} from "@/sanity/lib/queries";
import type { Category, Product } from "@/types";

export const metadata: Metadata = {
  title: "Tienda",
  description:
    "Catálogo completo de tacos profesionales, jump/break, estuches, bolas y accesorios.",
};

interface PageProps {
  searchParams: Promise<{ cat?: string }>;
}

export default async function ProductosPage({ searchParams }: PageProps) {
  const { cat } = await searchParams;

  const categories = await sanityFetch<Category[]>({
    query: allCategoriesQuery,
    tags: ["category", "product"],
  });

  const validSlugs = new Set(categories.map((c) => c.slug));
  const activeCat = cat && validSlugs.has(cat) ? cat : undefined;
  const activeCategory = activeCat ? categories.find((c) => c.slug === activeCat) : undefined;

  const products = activeCat
    ? await sanityFetch<Product[]>({
        query: productsByCategoryQuery,
        params: { cat: activeCat },
        tags: ["product"],
      })
    : await sanityFetch<Product[]>({
        query: allProductsQuery,
        tags: ["product"],
      });

  const totalProducts = categories.reduce((sum, c) => sum + (c.productCount ?? 0), 0);

  return (
    <Section spacing="md">
      <Container>
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Tienda
          </p>
          <h1 className="mt-3 font-display text-display-lg font-semibold tracking-tight">
            {activeCategory?.title ?? "Todos los productos"}
          </h1>
          <p className="mt-4 text-muted-foreground">
            {activeCategory?.blurb ??
              "Tacos, accesorios y bolas curados por jugadores. Marcas oficiales con garantía."}
          </p>
        </header>

        <nav
          aria-label="Filtrar por categoría"
          className="mt-10 flex flex-wrap gap-2 overflow-x-auto pb-2"
        >
          <FilterPill href="/productos" active={!activeCat}>
            Todos
            <span className="ml-1.5 text-muted-foreground">{totalProducts}</span>
          </FilterPill>
          {categories.map((c) => (
            <FilterPill
              key={c.slug}
              href={`/productos?cat=${c.slug}`}
              active={activeCat === c.slug}
            >
              {c.title}
              <span className="ml-1.5 text-muted-foreground">{c.productCount}</span>
            </FilterPill>
          ))}
        </nav>

        {products.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="mt-16 rounded-3xl border border-dashed border-border bg-muted/30 p-12 text-center text-muted-foreground">
            Sin productos en esta categoría todavía.
          </div>
        )}
      </Container>
    </Section>
  );
}

function FilterPill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={
        "inline-flex items-center whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all " +
        (active
          ? "border-primary bg-primary text-primary-foreground shadow-warm"
          : "border-border bg-card text-foreground/80 hover:border-primary/40 hover:text-foreground")
      }
    >
      {children}
    </Link>
  );
}
