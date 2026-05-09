import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { urlFor } from "@/sanity/lib/image";
import type { Product } from "@/types";

/**
 * Línea del carrito. Guardamos el snapshot mínimo necesario para renderizar
 * sin volver a consultar Sanity. El precio se persiste tal cual estaba al
 * momento de agregar; conviene revalidarlo en checkout antes de cobrar.
 */
export interface CartLine {
  id: string;
  slug: string;
  name: string;
  brand: string;
  /** Precio unitario ya con descuento aplicado. */
  price: number;
  /** Precio unitario antes de descuento, sólo si había descuento. */
  originalPrice?: number;
  imageUrl?: string | null;
  imageLqip?: string | null;
  imageAlt?: string;
  category?: string;
  quantity: number;
  /** Tope superior por inventario disponible. */
  maxStock?: number;
}

interface CartState {
  items: CartLine[];
  isOpen: boolean;
  /** `true` después de que persist hidrate desde localStorage. */
  hasHydrated: boolean;
}

interface CartActions {
  addItem: (input: Omit<CartLine, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setHasHydrated: (v: boolean) => void;
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(n, max));

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      hasHydrated: false,

      addItem: (input, quantity = 1) =>
        set((state) => {
          const max = input.maxStock ?? Infinity;
          const existing = state.items.find((it) => it.id === input.id);
          if (existing) {
            const next = clamp(existing.quantity + quantity, 1, max);
            return {
              items: state.items.map((it) =>
                it.id === input.id ? { ...it, ...input, quantity: next } : it,
              ),
              isOpen: true,
            };
          }
          return {
            items: [...state.items, { ...input, quantity: clamp(quantity, 1, max) }],
            isOpen: true,
          };
        }),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((it) => it.id !== id) })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items
            .map((it) => {
              if (it.id !== id) return it;
              const max = it.maxStock ?? Infinity;
              return { ...it, quantity: clamp(quantity, 0, max) };
            })
            .filter((it) => it.quantity > 0),
        })),

      increment: (id) =>
        set((state) => ({
          items: state.items.map((it) => {
            if (it.id !== id) return it;
            const max = it.maxStock ?? Infinity;
            return { ...it, quantity: Math.min(it.quantity + 1, max) };
          }),
        })),

      decrement: (id) =>
        set((state) => ({
          items: state.items
            .map((it) => (it.id === id ? { ...it, quantity: it.quantity - 1 } : it))
            .filter((it) => it.quantity > 0),
        })),

      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: "maestro-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Sólo persistir los items: `isOpen` debe iniciar cerrado en cada visita
      // y `hasHydrated` se setea en onRehydrateStorage.
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

// ──────────────────────────────────────────────────────────
// Selectores derivados (importables como argumento del hook)
// ──────────────────────────────────────────────────────────

export const selectCartCount = (s: CartState) =>
  s.items.reduce((sum, it) => sum + it.quantity, 0);

export const selectCartSubtotal = (s: CartState) =>
  s.items.reduce((sum, it) => sum + it.price * it.quantity, 0);

export const selectCartSavings = (s: CartState) =>
  s.items.reduce((sum, it) => {
    const base = it.originalPrice ?? it.price;
    return sum + (base - it.price) * it.quantity;
  }, 0);

// ──────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────

/**
 * Mapea un Product de Sanity a una CartLine y lo agrega al carrito.
 * Capturamos sólo los campos necesarios para mostrar la línea —
 * el resto lo trae la página de producto.
 */
export function addProductToCart(product: Product, quantity = 1) {
  const imageAsset = product.image?.asset;
  const imageUrl = imageAsset
    ? (urlFor(product.image)?.width(200).height(240).url() ?? null)
    : null;

  const finalPrice = product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;

  useCartStore.getState().addItem(
    {
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      category: product.categoryLabel ?? undefined,
      price: finalPrice,
      originalPrice: product.discount ? product.price : undefined,
      imageUrl,
      imageLqip: imageAsset?.lqip ?? null,
      imageAlt: product.image?.alt ?? product.name,
      maxStock: product.stock ?? undefined,
    },
    quantity,
  );
}

/** Costo de envío: gratis sobre cierto umbral, plano por debajo. */
export const SHIPPING_THRESHOLD_MXN = 5_000;
export const SHIPPING_FEE_MXN = 199;

export const selectShipping = (s: CartState) => {
  const subtotal = selectCartSubtotal(s);
  if (subtotal === 0) return 0;
  return subtotal >= SHIPPING_THRESHOLD_MXN ? 0 : SHIPPING_FEE_MXN;
};

export const selectCartTotal = (s: CartState) =>
  selectCartSubtotal(s) + selectShipping(s);
