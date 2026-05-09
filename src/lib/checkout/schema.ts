import { z } from "zod";

/**
 * Validación compartida entre el formulario (cliente) y `/api/checkout/preference` (servidor).
 * El servidor SIEMPRE re-valida con este schema; nunca confiar en el cliente.
 */

const optionalString = z
  .string()
  .trim()
  .max(120)
  .optional()
  .or(z.literal(""))
  .transform((v) => (v === "" ? undefined : v));

export const addressSchema = z.object({
  street: z.string().trim().min(3, "Calle muy corta").max(120),
  number: z.string().trim().min(1, "Requerido").max(20),
  apartment: optionalString,
  neighborhood: z.string().trim().min(2, "Colonia muy corta").max(120),
  city: z.string().trim().min(2, "Ciudad muy corta").max(120),
  state: z.string().trim().min(2, "Selecciona un estado").max(80),
  zip: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "Código postal de 5 dígitos"),
});

export const customerSchema = z.object({
  email: z.string().trim().toLowerCase().email("Correo inválido"),
  firstName: z.string().trim().min(2, "Nombre muy corto").max(80),
  lastName: z.string().trim().min(2, "Apellido muy corto").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "Teléfono de 10 dígitos sin espacios"),
  address: addressSchema,
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export type CheckoutFormInput = z.infer<typeof customerSchema>;

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
});

export const checkoutBodySchema = z.object({
  items: z.array(cartItemSchema).min(1, "El carrito está vacío"),
  customer: customerSchema,
});

export type CheckoutBody = z.infer<typeof checkoutBodySchema>;
