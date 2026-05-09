"use client";

import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  return (
    <form
      className="flex max-w-sm gap-2"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <label htmlFor="newsletter" className="sr-only">
        Correo electrónico
      </label>
      <input
        id="newsletter"
        type="email"
        required
        placeholder="tu@correo.mx"
        className="h-11 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
      />
      <Button type="submit" size="md">
        Suscribirme
      </Button>
    </form>
  );
}
