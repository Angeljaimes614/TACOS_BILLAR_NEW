"use client";

import { useEffect } from "react";

/**
 * Fallback de último recurso cuando falla el `RootLayout`.
 * Debe traer su propio `<html>` y `<body>`.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="es-MX">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          minHeight: "100dvh",
          margin: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          background: "#0e0d0b",
          color: "#f4ebd9",
        }}
      >
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <p
            style={{
              fontSize: 16,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#d4ad6f",
              marginBottom: 8,
            }}
          >
            Error crítico
          </p>
          <h1 style={{ fontSize: 36, lineHeight: 1.1, margin: "0 0 16px" }}>
            La aplicación no pudo cargar.
          </h1>
          <p style={{ opacity: 0.7, marginBottom: 24 }}>
            Recarga la página o intenta de nuevo en unos segundos.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: "12px 24px",
              borderRadius: 999,
              border: "none",
              background: "#b8915a",
              color: "#22170d",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reintentar
          </button>
          {error.digest ? (
            <p
              style={{
                marginTop: 16,
                fontSize: 11,
                opacity: 0.5,
                fontFamily: "ui-monospace, monospace",
              }}
            >
              ref: {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
