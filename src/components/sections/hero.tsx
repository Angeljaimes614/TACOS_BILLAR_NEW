"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-felt-cloth"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-noise opacity-[0.04] mix-blend-overlay"
      />
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 -z-10 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-0 -z-10 h-[420px] w-[420px] translate-x-1/3 rounded-full bg-secondary/15 blur-3xl"
      />

      <Container className="relative grid gap-16 py-20 md:py-28 lg:grid-cols-12 lg:gap-12 lg:py-36">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="flex flex-col justify-center lg:col-span-7"
        >
          <Badge variant="primary" className="w-fit">
            <Sparkles className="h-3.5 w-3.5" />
            Marcas oficiales · Garantía 2 años
          </Badge>

          <h1 className="mt-6 font-display text-display-xl font-semibold tracking-tight text-balance">
            El taco{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-brass-300 via-brass-500 to-brass-700 bg-clip-text text-transparent dark:from-brass-200 dark:via-brass-400 dark:to-brass-500">
                perfecto
              </span>
              <motion.svg
                aria-hidden
                viewBox="0 0 220 14"
                preserveAspectRatio="none"
                className="absolute -bottom-2 left-0 h-3 w-full text-primary/50"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5, ease }}
              >
                <motion.path
                  d="M2 8 Q 60 1 120 8 T 218 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </motion.svg>
            </span>{" "}
            te está esperando.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
            Tacos profesionales, estuches y accesorios para jugadores serios. Predator, Mezz,
            McDermott, Aramith y Kamui — con servicio de personalización y envío a todo México.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Link href="/productos">
              <Button size="lg">
                Explorar tienda
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/nosotros">
              <Button size="lg" variant="outline">
                Cómo elegir tu taco
              </Button>
            </Link>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease }}
            className="mt-14 grid grid-cols-3 gap-6 border-t border-border pt-8"
          >
            <Stat label="Marcas oficiales" value="14+" />
            <Stat label="Tacos enviados" value="9.4k" />
            <Stat
              label="Reseñas"
              value={
                <span className="inline-flex items-center gap-1">
                  4.9
                  <Star className="h-5 w-5 fill-primary text-primary" />
                </span>
              }
            />
          </motion.dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease }}
          className="relative lg:col-span-5"
        >
          <HeroVisual />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease }}
            className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-card p-4 shadow-soft-lg md:block"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-9 w-9 rounded-full border-2 border-card bg-gradient-to-br from-primary to-secondary"
                  />
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">+9,400 jugadores</p>
                <p className="text-xs text-muted-foreground">confían en Maestro</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.85, ease }}
            className="absolute -right-4 top-10 hidden rounded-2xl border border-border bg-card/90 px-4 py-3 shadow-soft-lg backdrop-blur lg:block"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Personalización
            </p>
            <p className="mt-1 font-display text-base font-semibold">
              Graba tus iniciales en el butt
            </p>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 font-display text-2xl font-semibold">{value}</dd>
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-[2.25rem] border border-border bg-gradient-felt shadow-soft-lg">
      <div aria-hidden className="absolute inset-0 bg-noise opacity-15 mix-blend-overlay" />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(244,235,217,0.12),transparent_55%)]"
      />

      <svg
        viewBox="0 0 400 500"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <linearGradient id="hero-shaft" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f4ebd9" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#f4ebd9" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#f4ebd9" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="hero-butt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5c3d24" />
            <stop offset="100%" stopColor="#22170d" />
          </linearGradient>
          <radialGradient id="hero-ball" cx="0.35" cy="0.3" r="0.7">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#f4ebd9" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0e0a06" stopOpacity="1" />
          </radialGradient>
        </defs>

        <motion.g
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <g transform="rotate(-22 200 250)">
            <rect x="20" y="244" width="280" height="14" rx="7" fill="url(#hero-shaft)" />
            <rect x="296" y="240" width="80" height="22" rx="3" fill="url(#hero-butt)" />
            <rect x="376" y="244" width="8" height="14" rx="2" fill="#b8915a" />
            <circle cx="18" cy="251" r="7" fill="#f4ebd9" />
            <circle cx="18" cy="251" r="4" fill="#b8915a" />
            <line
              x1="334"
              y1="240"
              x2="334"
              y2="262"
              stroke="#b8915a"
              strokeWidth="1.5"
              opacity="0.85"
            />
          </g>
        </motion.g>

        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9, type: "spring", stiffness: 180, damping: 16 }}
          style={{ transformOrigin: "120px 380px" }}
        >
          <circle cx="120" cy="380" r="56" fill="url(#hero-ball)" />
          <circle
            cx="120"
            cy="380"
            r="56"
            fill="none"
            stroke="#0e0a06"
            strokeOpacity="0.2"
            strokeWidth="1"
          />
          <circle cx="100" cy="360" r="9" fill="#ffffff" opacity="0.55" />
        </motion.g>
      </svg>

      <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-ivory-100">
        <div>
          <p className="font-script text-2xl text-ivory-200/90">edición</p>
          <p className="font-display text-3xl font-semibold leading-none">Predator P3</p>
          <p className="mt-1 text-xs uppercase tracking-[0.25em] text-ivory-200/70">
            Revo · Carbono 12.4
          </p>
        </div>
        <span className="rounded-full border border-ivory-200/30 bg-ivory-200/10 px-3 py-1 text-xs font-semibold backdrop-blur">
          Edición 2025
        </span>
      </div>
    </div>
  );
}
