"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // En producción este error se reportaría a Sentry / equivalente.
    console.error("[error.tsx]", error);
  }, [error]);

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-display text-7xl font-semibold text-primary">Oops</p>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">
        Algo salió del paño
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        Tuvimos un problema al cargar esta página. Reintenta en unos segundos o
        regresa al inicio.
      </p>
      {error.digest ? (
        <p className="mt-3 text-[11px] text-muted-foreground">
          Referencia: <code className="font-mono">{error.digest}</code>
        </p>
      ) : null}
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Button onClick={reset}>
          <RefreshCw className="h-4 w-4" />
          Reintentar
        </Button>
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Ir al inicio
        </Link>
      </div>
    </Container>
  );
}
