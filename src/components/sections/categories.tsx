"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Briefcase,
  CircleDot,
  Crosshair,
  Layers,
  type LucideIcon,
  Sparkles,
  Wrench,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { FadeInUp } from "@/components/motion/fade-in-up";
import type { Category } from "@/types";

const ICONS: Record<string, LucideIcon> = {
  Crosshair,
  Sparkles,
  Briefcase,
  CircleDot,
  Layers,
  Wrench,
};

interface CategoriesProps {
  categories: Category[];
}

export function Categories({ categories }: CategoriesProps) {
  if (!categories.length) return null;

  return (
    <Section spacing="md">
      <Container>
        <FadeInUp className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Explora por categoría
          </p>
          <h2 className="mt-3 font-display text-display-md font-semibold tracking-tight">
            Todo lo que necesitas para jugar como profesional
          </h2>
          <p className="mt-4 text-muted-foreground">
            De tacos de carbono a sets de bolas Aramith. Curado por jugadores, no por algoritmos.
          </p>
        </FadeInUp>

        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const Icon = (cat.icon && ICONS[cat.icon]) ?? Crosshair;
            return (
              <StaggerItem key={cat.id}>
                <Link
                  href={`/productos?cat=${cat.slug}`}
                  className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-soft transition-all duration-300 hover:border-primary/40 hover:shadow-soft-lg"
                >
                  <motion.div
                    aria-hidden
                    className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <div
                    aria-hidden
                    className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/5 blur-2xl transition-all duration-500 group-hover:bg-primary/15"
                  />

                  <div className="flex items-start justify-between">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-muted text-foreground transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="grid h-10 w-10 place-items-center rounded-full border border-border text-foreground/60 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>

                  <div className="mt-10">
                    <h3 className="font-display text-2xl font-semibold tracking-tight">
                      {cat.title}
                    </h3>
                    {cat.blurb ? (
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {cat.blurb}
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-border/70 pt-4 text-xs">
                    <span className="font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {cat.productCount} {cat.productCount === 1 ? "producto" : "productos"}
                    </span>
                    <span className="font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Ver colección →
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </Section>
  );
}
