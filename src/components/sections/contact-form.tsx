"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  return (
    <form
      className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre" id="name" />
        <Field label="Correo" id="email" type="email" />
      </div>
      <Field label="Asunto" id="subject" />
      <div className="space-y-1.5">
        <label htmlFor="message" className="text-sm font-medium">
          Mensaje
        </label>
        <textarea
          id="message"
          rows={5}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
      </div>
      <Button type="submit" className="w-full">
        Enviar mensaje
      </Button>
    </form>
  );
}

function Field({
  label,
  id,
  type = "text",
}: {
  label: string;
  id: string;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
      />
    </div>
  );
}
