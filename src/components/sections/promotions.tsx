"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Tag } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeInUp } from "@/components/motion/fade-in-up";
import type { Promotion } from "@/types";

interface PromotionsProps {
  promotions: Promotion[];
}

export function Promotions({ promotions }: PromotionsProps) {
  if (!promotions.length) return null;

  const big = promotions.find((p) => p.isFeatured) ?? promotions[0];
  if (!big) return null;
  const small = promotions.filter((p) => p.id !== big.id).slice(0, 2);

  return (
    <Section spacing="md">
      <Container>
        <FadeInUp className="mb-12 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Promociones del mes
          </p>
          <h2 className="mt-3 font-display text-display-md font-semibold tracking-tight">
            Descuentos para subir tu nivel
          </h2>
          <p className="mt-4 text-muted-foreground">
            Aprovecha precios especiales en marcas seleccionadas. Stock limitado.
          </p>
        </FadeInUp>

        <div className="grid gap-6 lg:grid-cols-12">
          <PromoBig promo={big} />
          {small.map((p, i) => (
            <PromoSmall key={p.id} promo={p} variant={i === 1 ? "alt" : undefined} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

function PromoBig({ promo }: { promo: Promotion }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group relative isolate overflow-hidden rounded-3xl bg-gradient-felt p-8 text-ivory-100 shadow-soft-lg sm:p-12 lg:col-span-7"
    >
      <div aria-hidden className="absolute inset-0 -z-10 bg-noise opacity-15 mix-blend-overlay" />
      <div
        aria-hidden
        className="absolute -right-20 -top-20 -z-10 h-80 w-80 rounded-full bg-primary/40 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-24 -left-10 -z-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
      />

      <Badge variant="primary" className="bg-primary text-primary-foreground">
        <Tag className="h-3 w-3" />
        {promo.badge ?? "Oferta destacada"}
      </Badge>

      <h3 className="mt-6 font-display text-display-md font-semibold leading-tight tracking-tight">
        {promo.title}
        {promo.subtitle ? (
          <>
            <br />
            <span className="text-brass-200">{promo.subtitle}</span>
          </>
        ) : null}
      </h3>

      {promo.description ? (
        <p className="mt-4 max-w-md text-base leading-relaxed text-ivory-200/85">
          {promo.description}
        </p>
      ) : null}

      <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
        <Link href={promo.cta?.href ?? "/productos"}>
          <Button
            size="lg"
            className="bg-ivory-100 text-walnut-800 shadow-warm hover:bg-ivory-50"
          >
            {promo.cta?.label ?? "Comprar ahora"}
          </Button>
        </Link>
        {promo.endDate ? <CountdownPill endDate={promo.endDate} /> : null}
      </div>
    </motion.div>
  );
}

function PromoSmall({ promo, variant }: { promo: Promotion; variant?: "alt" }) {
  const isAlt = variant === "alt";
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: isAlt ? 0.15 : 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className={`group relative isolate flex h-full flex-col overflow-hidden rounded-3xl border p-7 shadow-soft transition-shadow hover:shadow-soft-lg lg:col-span-5 ${
        isAlt
          ? "border-border bg-card"
          : "border-primary/20 bg-gradient-to-br from-primary/8 via-card to-card"
      }`}
    >
      <div
        aria-hidden
        className="absolute -right-10 -top-10 -z-10 h-44 w-44 rounded-full bg-primary/10 blur-2xl"
      />
      <Badge variant={isAlt ? "secondary" : "primary"}>
        <Sparkles className="h-3 w-3" />
        {promo.badge ?? (isAlt ? "Bundle" : "Oferta")}
      </Badge>

      <h3 className="mt-5 font-display text-2xl font-semibold leading-tight tracking-tight">
        {promo.title}
      </h3>
      {promo.description ? (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {promo.description}
        </p>
      ) : null}

      <div className="mt-auto flex items-end justify-between pt-6">
        {promo.discountPercent ? (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Hasta
            </p>
            <p className="font-display text-2xl font-semibold tracking-tight">
              -{promo.discountPercent}%
            </p>
          </div>
        ) : (
          <span />
        )}
        <Link
          href={promo.cta?.href ?? "/productos"}
          className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          {promo.cta?.label ?? "Ver oferta"} →
        </Link>
      </div>
    </motion.div>
  );
}

function CountdownPill({ endDate }: { endDate: string }) {
  const diff = Math.max(0, new Date(endDate).getTime() - Date.now());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  const items = [
    { value: String(days).padStart(2, "0"), label: "días" },
    { value: String(hours).padStart(2, "0"), label: "hrs" },
    { value: String(mins).padStart(2, "0"), label: "min" },
  ];
  return (
    <div className="flex items-center gap-2">
      {items.map((it) => (
        <div
          key={it.label}
          className="rounded-2xl border border-ivory-200/20 bg-ivory-100/10 px-3 py-2 text-center backdrop-blur"
        >
          <p className="font-display text-xl font-semibold leading-none">{it.value}</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-ivory-200/70">
            {it.label}
          </p>
        </div>
      ))}
    </div>
  );
}
