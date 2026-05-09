"use client";

import { Toaster as SonnerToaster } from "sonner";

/**
 * Sonner pre-configurado con la estética del sitio.
 * Se monta una sola vez en `(site)/layout.tsx`.
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      expand={false}
      toastOptions={{
        classNames: {
          toast:
            "group !rounded-2xl !border-border !bg-card !text-card-foreground !shadow-soft-lg",
          title: "!font-display !text-sm !font-semibold",
          description: "!text-xs !text-muted-foreground",
        },
      }}
    />
  );
}
