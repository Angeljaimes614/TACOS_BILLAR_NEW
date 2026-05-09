"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem } from "./cart-item";
import { CartSummary } from "./cart-summary";
import { EmptyCart } from "./empty-cart";
import { selectCartCount, useCartStore } from "@/lib/store/cart-store";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Sidebar de carrito. Se monta a nivel de layout para estar disponible en
 * todas las páginas del sitio. La hidratación de items se hace via persist;
 * sólo se muestra cuando `isOpen=true`, que sucede tras interacción del
 * usuario, evitando cualquier mismatch de SSR.
 */
export function CartSheet() {
  const router = useRouter();
  const isOpen = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);
  const clear = useCartStore((s) => s.clear);
  const items = useCartStore((s) => s.items);
  const count = useCartStore(selectCartCount);

  const goToCheckout = React.useCallback(() => {
    close();
    router.push("/checkout");
  }, [close, router]);

  // Lock del scroll del body
  React.useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // ESC para cerrar
  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            onClick={close}
            aria-hidden
            className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm"
          />

          <motion.aside
            key="cart-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Carrito de compras"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 32 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-background shadow-2xl"
          >
            <header className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <h2 className="font-display text-xl font-semibold tracking-tight">
                  Tu carrito
                </h2>
                <p className="text-xs text-muted-foreground">
                  {count > 0
                    ? `${count} ${count === 1 ? "artículo" : "artículos"}`
                    : "Sin artículos por ahora"}
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Cerrar carrito"
                className="grid h-10 w-10 place-items-center rounded-full text-foreground transition-colors hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex-1 overflow-y-auto">
                <EmptyCart />
              </div>
            ) : (
              <>
                <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-5">
                  <ul className="flex flex-col gap-3">
                    <AnimatePresence initial={false}>
                      {items.map((item) => (
                        <CartItem
                          key={item.id}
                          item={item}
                          onNavigate={close}
                        />
                      ))}
                    </AnimatePresence>
                  </ul>

                  <button
                    type="button"
                    onClick={clear}
                    className="mt-2 self-start text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    Vaciar carrito
                  </button>
                </div>

                <footer className="border-t border-border bg-card/60 px-6 py-5">
                  <CartSummary />
                  <Button
                    size="lg"
                    className="mt-5 w-full"
                    onClick={goToCheckout}
                  >
                    Ir a checkout
                  </Button>
                  <button
                    type="button"
                    onClick={close}
                    className="mt-3 w-full text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
                  >
                    Seguir comprando
                  </button>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
