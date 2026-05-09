"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Plus, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { urlFor } from "@/sanity/lib/image";
import { addProductToCart } from "@/lib/store/cart-store";
import { cn, formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const finalPrice = product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;

  const imageAsset = product.image?.asset;
  const imageUrl = imageAsset
    ? urlFor(product.image)?.width(800).height(960).url() ?? undefined
    : undefined;

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-shadow duration-300 hover:shadow-soft-lg",
        className,
      )}
    >
      <div className="relative aspect-[5/6] overflow-hidden bg-gradient-to-br from-secondary/15 via-card to-primary/10">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.image?.alt ?? product.name}
            fill
            sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            placeholder={imageAsset?.lqip ? "blur" : "empty"}
            blurDataURL={imageAsset?.lqip ?? undefined}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <CueArtwork brand={product.brand} />
        )}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/15 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-background/40"
        />
        <div aria-hidden className="absolute inset-0 bg-noise opacity-[0.05] mix-blend-overlay" />

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isNew && <Badge variant="primary">Nuevo</Badge>}
          {product.isBestSeller && <Badge variant="secondary">Top ventas</Badge>}
          {product.discount ? <Badge variant="accent">-{product.discount}%</Badge> : null}
        </div>

        <button
          type="button"
          aria-label="Guardar en favoritos"
          onClick={(e) => e.preventDefault()}
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-background/85 text-foreground/80 backdrop-blur transition hover:bg-background hover:text-primary"
        >
          <Heart className="h-4 w-4" />
        </button>

        <div className="absolute inset-x-3 bottom-3 flex translate-y-3 items-center justify-between opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="rounded-full bg-background/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/80 backdrop-blur">
            {product.brand}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addProductToCart(product);
            }}
            disabled={!product.inStock}
            aria-label={`Agregar ${product.name} al carrito`}
            className="z-10 grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-warm transition hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {product.categoryLabel ?? product.category}
          </span>
          {product.rating ? (
            <span className="inline-flex items-center gap-1 text-foreground/80">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              <span className="font-medium">{product.rating.toFixed(1)}</span>
              {product.reviewCount ? (
                <span className="text-muted-foreground">({product.reviewCount})</span>
              ) : null}
            </span>
          ) : null}
        </div>

        <h3 className="font-display text-lg font-semibold leading-tight tracking-tight">
          <Link
            href={`/productos/${product.slug}`}
            className="outline-none after:absolute after:inset-0 after:rounded-3xl focus-visible:after:ring-2 focus-visible:after:ring-ring"
          >
            {product.name}
          </Link>
        </h3>

        <p className="line-clamp-2 text-sm text-muted-foreground">{product.shortDescription}</p>

        <div className="mt-auto flex items-end justify-between pt-3">
          <div className="flex flex-col">
            <span className="font-display text-xl font-semibold tracking-tight">
              {formatCurrency(finalPrice)}
            </span>
            {product.discount ? (
              <span className="text-xs text-muted-foreground line-through">
                {formatCurrency(product.price)}
              </span>
            ) : null}
          </div>
          {product.inStock ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-secondary-foreground/80">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
              En stock
            </span>
          ) : (
            <span className="text-[11px] text-muted-foreground">Agotado</span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function CueArtwork({ brand }: { brand: string }) {
  const initial = brand.charAt(0).toUpperCase();
  return (
    <svg
      viewBox="0 0 400 480"
      className="h-full w-full"
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="cue-shaft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
          <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.85" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id="cue-butt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--secondary))" />
          <stop offset="100%" stopColor="hsl(var(--secondary) / 0.7)" />
        </linearGradient>
        <radialGradient id="ball-grad" cx="0.35" cy="0.3" r="0.7">
          <stop offset="0%" stopColor="hsl(var(--background))" stopOpacity="0.95" />
          <stop offset="60%" stopColor="hsl(var(--card))" stopOpacity="0.6" />
          <stop offset="100%" stopColor="hsl(var(--foreground) / 0.2)" stopOpacity="1" />
        </radialGradient>
      </defs>

      <g transform="rotate(-22 200 240)">
        <rect x="60" y="232" width="240" height="14" rx="7" fill="url(#cue-shaft)" />
        <rect x="296" y="228" width="60" height="22" rx="3" fill="url(#cue-butt)" />
        <rect x="356" y="232" width="6" height="14" rx="2" fill="hsl(var(--primary))" />
        <circle cx="58" cy="239" r="6" fill="hsl(var(--accent))" />
        <circle cx="58" cy="239" r="3.5" fill="hsl(var(--primary))" opacity="0.8" />
      </g>

      <g transform="translate(285 350)">
        <circle r="42" fill="url(#ball-grad)" />
        <circle r="42" fill="none" stroke="hsl(var(--foreground) / 0.1)" strokeWidth="1" />
        <circle cx="-14" cy="-14" r="6" fill="hsl(var(--background))" opacity="0.6" />
        <text
          textAnchor="middle"
          y="6"
          fontSize="22"
          fontWeight="700"
          fontFamily="serif"
          fill="hsl(var(--foreground))"
          opacity="0.55"
        >
          {initial}
        </text>
      </g>
    </svg>
  );
}
