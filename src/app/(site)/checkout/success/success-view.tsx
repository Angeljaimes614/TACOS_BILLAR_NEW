"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Package, Mail } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";

interface Props {
  orderId?: string;
  paymentId?: string;
}

export function SuccessView({ orderId, paymentId }: Props) {
  // Vaciar el carrito una vez confirmado el pago.
  React.useEffect(() => {
    useCartStore.getState().clear();
  }, []);

  return (
    <Section spacing="md">
      <Container size="md" className="text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-secondary/15 text-secondary"
        >
          <CheckCircle2 className="h-12 w-12" strokeWidth={1.5} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="mt-8 font-display text-display-md font-semibold tracking-tight">
            ¡Tu pago fue aprobado!
          </h1>
          <p className="mt-3 text-muted-foreground">
            Estamos preparando tu pedido. Te enviaremos un correo con la guía de envío
            tan pronto salga del almacén.
          </p>
        </motion.div>

        {(orderId || paymentId) && (
          <dl className="mx-auto mt-10 grid max-w-sm gap-3 rounded-2xl border border-border bg-card p-5 text-left text-sm">
            {orderId ? (
              <Row label="Número de orden">
                <code className="rounded bg-muted px-2 py-0.5 font-mono text-xs">
                  {orderId}
                </code>
              </Row>
            ) : null}
            {paymentId ? (
              <Row label="ID de pago Mercado Pago">
                <code className="rounded bg-muted px-2 py-0.5 font-mono text-xs">
                  {paymentId}
                </code>
              </Row>
            ) : null}
          </dl>
        )}

        <ul className="mx-auto mt-10 grid max-w-md gap-3 text-left text-sm text-muted-foreground">
          <li className="flex items-start gap-3">
            <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary" />
            Recibirás el comprobante en tu correo en los próximos minutos.
          </li>
          <li className="flex items-start gap-3">
            <Package className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary" />
            Empacamos en 24h hábiles. Entrega típica: 2-4 días en CDMX, 4-7 en interior.
          </li>
        </ul>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/productos">
            <Button>Seguir comprando</Button>
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            Volver al inicio
          </Link>
        </div>
      </Container>
    </Section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </dt>
      <dd>{children}</dd>
    </div>
  );
}
