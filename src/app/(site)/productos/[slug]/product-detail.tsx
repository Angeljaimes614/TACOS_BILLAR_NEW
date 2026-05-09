"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Flame,
  Heart,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { addProductToCart, useCartStore } from "@/lib/store/cart-store";
import { urlFor } from "@/sanity/lib/image";
import { cn, formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const open = useCartStore((s) => s.open);
  const [activeIdx, setActiveIdx] = React.useState(0);

  const images = product.images?.length ? product.images : product.image ? [product.image] : [];
  const mainImage = images[activeIdx] ?? null;
  const mainUrl = mainImage?.asset
    ? (urlFor(mainImage)?.width(1200).height(1500).url() ?? null)
    : null;

  const finalPrice = product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;
  const savings = product.discount ? product.price - finalPrice : 0;

  function handleAddToCart() {
    addProductToCart(product, 1);
    open();
  }

  return (
    <Section spacing="md">
      <Container>
        <Breadcrumbs product={product} />

        <div className="mt-8 grid gap-12 lg:grid-cols-12">
          {/* Galería */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-secondary/15 via-card to-primary/10">
              {mainUrl ? (
                <motion.div
                  key={activeIdx}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={mainUrl}
                    alt={mainImage?.alt ?? product.name}
                    fill
                    sizes="(min-width: 1024px) 56vw, 100vw"
                    placeholder={mainImage?.asset?.lqip ? "blur" : "empty"}
                    blurDataURL={mainImage?.asset?.lqip ?? undefined}
                    className="object-cover"
                    priority
                  />
                </motion.div>
              ) : (
                <FallbackArt brand={product.brand} />
              )}
              <div aria-hidden className="absolute inset-0 bg-noise opacity-[0.05] mix-blend-overlay" />

              <div className="absolute left-4 top-4 flex flex-col gap-1.5">
                {product.isNew ? <Badge variant="primary">Nuevo</Badge> : null}
                {product.isBestSeller ? <Badge variant="secondary">Top ventas</Badge> : null}
                {product.discount ? <Badge variant="accent">-{product.discount}%</Badge> : null}
              </div>

              <button
                type="button"
                aria-label="Guardar en favoritos"
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-background/85 text-foreground/80 backdrop-blur transition hover:bg-background hover:text-primary"
              >
                <Heart className="h-4 w-4" />
              </button>
            </div>

            {images.length > 1 ? (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                {images.map((img, i) => {
                  const thumb = img.asset
                    ? urlFor(img)?.width(160).height(200).url()
                    : null;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveIdx(i)}
                      aria-label={`Ver imagen ${i + 1}`}
                      aria-current={i === activeIdx}
                      className={cn(
                        "relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-muted transition-all",
                        i === activeIdx
                          ? "border-primary"
                          : "border-transparent opacity-70 hover:opacity-100",
                      )}
                    >
                      {thumb ? (
                        <Image
                          src={thumb}
                          alt={img.alt ?? `${product.name} – imagen ${i + 1}`}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          {/* Información */}
          <div className="lg:col-span-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              {product.brand}
              {product.categoryLabel ? ` · ${product.categoryLabel}` : ""}
            </p>

            <h1 className="mt-2 font-display text-display-md font-semibold tracking-tight">
              {product.name}
            </h1>

            {product.rating ? (
              <div className="mt-3 flex items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-semibold tabular-nums">
                    {product.rating.toFixed(1)}
                  </span>
                </span>
                {product.reviewCount ? (
                  <span className="text-muted-foreground">
                    · {product.reviewCount} reseñas
                  </span>
                ) : null}
              </div>
            ) : null}

            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              {product.shortDescription}
            </p>

            <div className="mt-8 flex items-end gap-4">
              <span className="font-display text-4xl font-semibold tabular-nums tracking-tight">
                {formatCurrency(finalPrice)}
              </span>
              {product.discount ? (
                <div className="flex flex-col leading-tight">
                  <span className="text-sm text-muted-foreground line-through tabular-nums">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-xs font-medium text-secondary">
                    Ahorras {formatCurrency(savings)}
                  </span>
                </div>
              ) : null}
            </div>

            <div className="mt-2 flex items-center gap-2 text-sm">
              {product.inStock ? (
                <>
                  <span className="inline-flex h-2 w-2 rounded-full bg-secondary" />
                  <span className="text-muted-foreground">
                    En stock
                    {typeof product.stock === "number" ? ` · ${product.stock} disponibles` : ""}
                  </span>
                </>
              ) : (
                <>
                  <span className="inline-flex h-2 w-2 rounded-full bg-destructive" />
                  <span className="text-destructive">Agotado</span>
                </>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <Plus className="h-4 w-4" />
                {product.inStock ? "Agregar al carrito" : "Agotado"}
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="h-4 w-4" />
                Guardar
              </Button>
            </div>

            {/* Specs */}
            {product.specs?.length ? (
              <dl className="mt-10 divide-y divide-border rounded-2xl border border-border bg-card">
                {product.specs.map((spec, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm"
                  >
                    <dt className="font-medium text-muted-foreground">{spec.label}</dt>
                    <dd className="font-medium tabular-nums">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {/* Garantías */}
            <ul className="mt-8 grid gap-3 text-sm">
              <Perk icon={Truck} title="Envío en 2-4 días">
                Envío gratis en pedidos +$5,000 MXN
              </Perk>
              <Perk icon={ShieldCheck} title="Garantía 2 años">
                Soporte directo con la marca oficial
              </Perk>
              <Perk icon={Sparkles} title="Personalización disponible">
                Graba tus iniciales en el butt sin costo
              </Perk>
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function Breadcrumbs({ product }: { product: Product }) {
  return (
    <nav aria-label="Breadcrumbs" className="text-xs text-muted-foreground">
      <ol className="flex items-center gap-1.5">
        <li>
          <Link href="/" className="hover:text-foreground">
            Inicio
          </Link>
        </li>
        <ChevronRight className="h-3 w-3" />
        <li>
          <Link href="/productos" className="hover:text-foreground">
            Tienda
          </Link>
        </li>
        {product.categoryLabel && product.category ? (
          <>
            <ChevronRight className="h-3 w-3" />
            <li>
              <Link
                href={`/productos?cat=${product.category}`}
                className="hover:text-foreground"
              >
                {product.categoryLabel}
              </Link>
            </li>
          </>
        ) : null}
        <ChevronRight className="h-3 w-3" />
        <li className="truncate font-medium text-foreground">{product.name}</li>
      </ol>
    </nav>
  );
}

function Perk({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Flame;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{children}</p>
      </div>
    </li>
  );
}

function FallbackArt({ brand }: { brand: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-secondary/20 to-primary/20">
      <span className="font-display text-7xl font-bold text-foreground/30">
        {brand.charAt(0)}
      </span>
    </div>
  );
}
