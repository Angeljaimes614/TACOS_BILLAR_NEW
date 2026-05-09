"use client";

import { motion } from "framer-motion";
import { XCircle } from "lucide-react";

interface Props {
  orderId?: string;
  status?: string;
}

export function FailureClient({ orderId, status }: Props) {
  return (
    <>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-destructive/10 text-destructive"
      >
        <XCircle className="h-12 w-12" strokeWidth={1.5} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="mt-8 font-display text-display-md font-semibold tracking-tight">
          No pudimos procesar el pago
        </h1>
        <p className="mt-3 text-muted-foreground">
          Tu carrito sigue intacto. Puedes intentar con otro método de pago o
          contactarnos si crees que es un error.
        </p>
        {orderId ? (
          <p className="mt-3 text-xs text-muted-foreground">
            Referencia:{" "}
            <code className="rounded bg-muted px-2 py-0.5 font-mono">
              {orderId}
            </code>
            {status ? ` · estado: ${status}` : null}
          </p>
        ) : null}
      </motion.div>
    </>
  );
}
