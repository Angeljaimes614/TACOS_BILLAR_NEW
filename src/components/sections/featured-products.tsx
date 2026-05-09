"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/product-card";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { FadeInUp } from "@/components/motion/fade-in-up";
import type { Product } from "@/types";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (!products.length) return null;

  return (
    <Section spacing="lg" className="bg-muted/40">
      <Container>
        <FadeInUp className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Productos destacados
            </p>
            <h2 className="mt-3 font-display text-display-md font-semibold tracking-tight">
              Lo más jugado esta temporada
            </h2>
            <p className="mt-4 text-muted-foreground">
              Selección actualizada cada mes con los favoritos de la comunidad.
            </p>
          </div>
          <Link href="/productos">
            <Button variant="outline" size="md">
              Ver toda la tienda
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </FadeInUp>

        <Stagger
          amount={0.1}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {products.map((p) => (
            <StaggerItem key={p.id}>
              <ProductCard product={p} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
