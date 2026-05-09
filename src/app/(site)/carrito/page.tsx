import type { Metadata } from "next";
import { CartView } from "./cart-view";

export const metadata: Metadata = {
  title: "Carrito",
  description: "Tu selección lista para finalizar.",
};

export default function CartPage() {
  return <CartView />;
}
