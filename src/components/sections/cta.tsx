"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, MapPin, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/constants";

export function CTA() {
  return (
    <Section spacing="md">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative isolate overflow-hidden rounded-[2rem] border border-border bg-gradient-brass px-6 py-16 text-walnut-900 sm:px-12 md:py-20"
        >
          <div aria-hidden className="absolute inset-0 -z-10 bg-noise opacity-15 mix-blend-overlay" />
          <div
            aria-hidden
            className="absolute -right-20 -top-20 -z-10 h-80 w-80 rounded-full bg-ivory-100/40 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-24 -left-10 -z-10 h-72 w-72 rounded-full bg-felt-700/30 blur-3xl"
          />

          <div className="grid gap-10 md:grid-cols-12 md:items-center">
            <div className="md:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-walnut-800/80">
                ¿Listo para subir de nivel?
              </p>
              <h2 className="mt-3 font-display text-display-md font-semibold tracking-tight">
                Visita la tienda o agenda una sesión de prueba
              </h2>
              <p className="mt-4 max-w-xl text-base/relaxed text-walnut-900/85">
                En nuestra showroom puedes probar tacos antes de comprar. También enviamos a
                todo México con seguro incluido.
              </p>
            </div>

            <div className="flex flex-col gap-3 md:col-span-5 md:items-end">
              <Link href="/productos" className="w-full md:w-auto">
                <Button
                  size="lg"
                  className="w-full bg-walnut-800 text-ivory-100 shadow-soft-lg hover:bg-walnut-900 md:w-auto"
                >
                  Comprar en línea
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link
                href={`tel:${SITE_CONFIG.contact.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-walnut-900/90 hover:text-walnut-900"
              >
                <Phone className="h-4 w-4" />
                {SITE_CONFIG.contact.phone}
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-walnut-900/85">
                <MapPin className="h-4 w-4" />
                {SITE_CONFIG.contact.address}
              </span>
            </div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
