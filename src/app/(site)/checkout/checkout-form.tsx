"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  FormField,
  inputClass,
  selectClass,
  textareaClass,
} from "@/components/ui/form-field";
import { customerSchema, type CheckoutFormInput } from "@/lib/checkout/schema";
import { MX_STATES } from "@/lib/checkout/states";
import { useCartStore } from "@/lib/store/cart-store";

interface PreferenceResponse {
  orderId: string;
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint?: string;
}

export function CheckoutForm() {
  const items = useCartStore((s) => s.items);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<CheckoutFormInput>({
    resolver: zodResolver(customerSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      address: {
        street: "",
        number: "",
        apartment: "",
        neighborhood: "",
        city: "",
        state: "",
        zip: "",
      },
      notes: "",
    },
  });

  const onSubmit = async (data: CheckoutFormInput) => {
    if (items.length === 0) {
      toast.error("Tu carrito está vacío.");
      return;
    }

    try {
      const res = await fetch("/api/checkout/preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: data,
          items: items.map((it) => ({
            productId: it.id,
            quantity: it.quantity,
          })),
        }),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as {
          error?: string;
          issues?: { fieldErrors?: Record<string, string[]> };
        };

        // Si el servidor devuelve errores por campo (Zod), inyectarlos al form.
        if (payload.issues?.fieldErrors) {
          for (const [path, msgs] of Object.entries(payload.issues.fieldErrors)) {
            if (msgs?.[0]) {
              setError(path as keyof CheckoutFormInput, { message: msgs[0] });
            }
          }
        }
        throw new Error(payload.error ?? "No pudimos iniciar el pago.");
      }

      const result = (await res.json()) as PreferenceResponse;
      toast.success("Redirigiendo a Mercado Pago…");
      // Pequeño delay para que el toast se vea antes del redirect.
      setTimeout(() => {
        window.location.href = result.initPoint;
      }, 250);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al procesar el pago.";
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-10">
      <Fieldset
        title="Contacto"
        description="Te enviaremos la confirmación a este correo."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Correo"
            htmlFor="email"
            required
            error={errors.email?.message}
            className="sm:col-span-2"
          >
            <input
              id="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="tu@correo.mx"
              aria-invalid={!!errors.email}
              className={inputClass}
              {...register("email")}
            />
          </FormField>
          <FormField
            label="Nombre"
            htmlFor="firstName"
            required
            error={errors.firstName?.message}
          >
            <input
              id="firstName"
              autoComplete="given-name"
              aria-invalid={!!errors.firstName}
              className={inputClass}
              {...register("firstName")}
            />
          </FormField>
          <FormField
            label="Apellido"
            htmlFor="lastName"
            required
            error={errors.lastName?.message}
          >
            <input
              id="lastName"
              autoComplete="family-name"
              aria-invalid={!!errors.lastName}
              className={inputClass}
              {...register("lastName")}
            />
          </FormField>
          <FormField
            label="Teléfono"
            htmlFor="phone"
            required
            error={errors.phone?.message}
            hint="10 dígitos sin espacios. Ej: 5512345678"
            className="sm:col-span-2"
          >
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="5512345678"
              aria-invalid={!!errors.phone}
              className={inputClass}
              {...register("phone")}
            />
          </FormField>
        </div>
      </Fieldset>

      <Fieldset
        title="Dirección de envío"
        description="Enviamos a toda la república con seguro incluido."
      >
        <div className="grid gap-4 sm:grid-cols-6">
          <FormField
            label="Calle"
            htmlFor="address.street"
            required
            error={errors.address?.street?.message}
            className="sm:col-span-4"
          >
            <input
              id="address.street"
              autoComplete="address-line1"
              aria-invalid={!!errors.address?.street}
              className={inputClass}
              {...register("address.street")}
            />
          </FormField>
          <FormField
            label="Número"
            htmlFor="address.number"
            required
            error={errors.address?.number?.message}
            className="sm:col-span-2"
          >
            <input
              id="address.number"
              autoComplete="address-line2"
              aria-invalid={!!errors.address?.number}
              className={inputClass}
              {...register("address.number")}
            />
          </FormField>
          <FormField
            label="Interior / depto."
            htmlFor="address.apartment"
            error={errors.address?.apartment?.message}
            hint="Opcional"
            className="sm:col-span-2"
          >
            <input
              id="address.apartment"
              autoComplete="address-line2"
              className={inputClass}
              {...register("address.apartment")}
            />
          </FormField>
          <FormField
            label="Colonia"
            htmlFor="address.neighborhood"
            required
            error={errors.address?.neighborhood?.message}
            className="sm:col-span-4"
          >
            <input
              id="address.neighborhood"
              aria-invalid={!!errors.address?.neighborhood}
              className={inputClass}
              {...register("address.neighborhood")}
            />
          </FormField>
          <FormField
            label="Ciudad"
            htmlFor="address.city"
            required
            error={errors.address?.city?.message}
            className="sm:col-span-3"
          >
            <input
              id="address.city"
              autoComplete="address-level2"
              aria-invalid={!!errors.address?.city}
              className={inputClass}
              {...register("address.city")}
            />
          </FormField>
          <FormField
            label="Estado"
            htmlFor="address.state"
            required
            error={errors.address?.state?.message}
            className="sm:col-span-2"
          >
            <select
              id="address.state"
              autoComplete="address-level1"
              aria-invalid={!!errors.address?.state}
              defaultValue=""
              className={selectClass}
              {...register("address.state")}
            >
              <option value="" disabled>
                Selecciona…
              </option>
              {MX_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </FormField>
          <FormField
            label="Código postal"
            htmlFor="address.zip"
            required
            error={errors.address?.zip?.message}
            className="sm:col-span-1"
          >
            <input
              id="address.zip"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={5}
              aria-invalid={!!errors.address?.zip}
              className={inputClass}
              {...register("address.zip")}
            />
          </FormField>
        </div>
      </Fieldset>

      <Fieldset title="Notas (opcional)">
        <FormField
          label="Comentarios para el envío"
          htmlFor="notes"
          error={errors.notes?.message}
          hint="Indicaciones, referencias o un mensaje para el equipo."
        >
          <textarea
            id="notes"
            rows={4}
            className={textareaClass}
            {...register("notes")}
          />
        </FormField>
      </Fieldset>

      <div className="space-y-3 border-t border-border pt-6">
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting || items.length === 0}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Conectando con Mercado Pago…
            </>
          ) : (
            <>
              Pagar con Mercado Pago
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
        <p className="text-center text-[11px] text-muted-foreground">
          Al continuar aceptas nuestros términos y políticas de privacidad.
        </p>
      </div>
    </form>
  );
}

function Fieldset({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-5">
      <legend className="block">
        <h2 className="font-display text-xl font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </legend>
      {children}
    </fieldset>
  );
}
