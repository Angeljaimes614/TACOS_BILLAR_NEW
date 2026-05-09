import { randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { Preference } from "mercadopago";
import { ZodError } from "zod";
import { checkoutBodySchema } from "@/lib/checkout/schema";
import { getBaseUrl, getMpClient } from "@/lib/checkout/mercadopago";
import { sanityFetch } from "@/sanity/lib/fetch";
import { productsByIdsQuery } from "@/sanity/lib/queries";
import { orderDocId, tryGetWriteClient } from "@/sanity/lib/server-client";
import { SHIPPING_FEE_MXN, SHIPPING_THRESHOLD_MXN } from "@/lib/store/cart-store";
import type { Product } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface MpItem {
  id: string;
  title: string;
  description?: string;
  quantity: number;
  currency_id: "MXN";
  unit_price: number;
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = checkoutBodySchema.parse(json);

    // ── Re-validar contra Sanity (precio, stock, existencia) ─────────
    const ids = parsed.items.map((it) => it.productId);
    const products = await sanityFetch<Product[]>({
      query: productsByIdsQuery,
      params: { ids },
      revalidate: 0,
      tags: ["product"],
    });

    if (products.length !== ids.length) {
      return NextResponse.json(
        { error: "Algunos productos ya no están disponibles." },
        { status: 409 },
      );
    }

    const mpItems: MpItem[] = [];

    for (const line of parsed.items) {
      const product = products.find((p) => p.id === line.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Producto no encontrado: ${line.productId}` },
          { status: 409 },
        );
      }
      if (!product.inStock) {
        return NextResponse.json(
          { error: `${product.name} se quedó sin stock.` },
          { status: 409 },
        );
      }
      if (typeof product.stock === "number" && line.quantity > product.stock) {
        return NextResponse.json(
          { error: `Sólo hay ${product.stock} de ${product.name} disponibles.` },
          { status: 409 },
        );
      }

      const finalPrice = product.discount
        ? Math.round(product.price * (1 - product.discount / 100))
        : product.price;

      mpItems.push({
        id: product.id,
        title: product.name,
        description: product.shortDescription,
        quantity: line.quantity,
        currency_id: "MXN",
        unit_price: finalPrice,
      });
    }

    // ── Envío como línea aparte si aplica ────────────────────────────
    const subtotal = mpItems.reduce(
      (sum, it) => sum + it.unit_price * it.quantity,
      0,
    );
    const shipping = subtotal >= SHIPPING_THRESHOLD_MXN ? 0 : SHIPPING_FEE_MXN;
    if (shipping > 0) {
      mpItems.push({
        id: "shipping",
        title: "Envío estándar",
        quantity: 1,
        currency_id: "MXN",
        unit_price: shipping,
      });
    }

    const orderId = randomUUID();
    const baseUrl = getBaseUrl();

    // Persistir la orden en Sanity con status "pending" antes de crear la
    // preferencia. Si falla (token no configurado, Sanity caído), seguimos
    // con el checkout — el webhook intentará nuevamente al confirmar el pago.
    const writeClient = tryGetWriteClient();
    if (writeClient) {
      try {
        await writeClient.createIfNotExists({
          _id: orderDocId(orderId),
          _type: "order",
          orderId,
          status: "pending",
          customer: parsed.customer,
          items: mpItems
            .filter((it) => it.id !== "shipping")
            .map((it) => {
              const product = products.find((p) => p.id === it.id);
              return {
                _key: it.id,
                _type: "lineItem",
                productId: it.id,
                name: it.title,
                brand: product?.brand,
                quantity: it.quantity,
                unitPrice: it.unit_price,
                lineTotal: it.unit_price * it.quantity,
                product: { _type: "reference", _ref: it.id },
              };
            }),
          subtotal,
          shipping,
          total: subtotal + shipping,
          currency: "MXN",
        });
      } catch (err) {
        console.warn("[checkout] no se pudo persistir orden:", err);
      }
    }

    const preference = new Preference(getMpClient());

    const result = await preference.create({
      body: {
        items: mpItems,
        payer: {
          email: parsed.customer.email,
          name: parsed.customer.firstName,
          surname: parsed.customer.lastName,
          phone: { area_code: "52", number: parsed.customer.phone },
          address: {
            street_name: parsed.customer.address.street,
            street_number: Number(parsed.customer.address.number) || undefined,
            zip_code: parsed.customer.address.zip,
          },
        },
        shipments: {
          receiver_address: {
            street_name: parsed.customer.address.street,
            street_number: Number(parsed.customer.address.number) || undefined,
            zip_code: parsed.customer.address.zip,
            city_name: parsed.customer.address.city,
            state_name: parsed.customer.address.state,
            country_name: "México",
            apartment: parsed.customer.address.apartment,
          },
        },
        back_urls: {
          success: `${baseUrl}/checkout/success?order=${orderId}`,
          failure: `${baseUrl}/checkout/failure?order=${orderId}`,
          pending: `${baseUrl}/checkout/pending?order=${orderId}`,
        },
        auto_return: "approved",
        notification_url: `${baseUrl}/api/checkout/webhook`,
        external_reference: orderId,
        statement_descriptor: "MAESTRO BILLAR",
        metadata: {
          customer_email: parsed.customer.email,
          customer_phone: parsed.customer.phone,
          notes: parsed.customer.notes,
        },
        // Expira en 30 minutos
        expires: true,
        expiration_date_to: new Date(Date.now() + 30 * 60_000).toISOString(),
      },
    });

    // Guardar el preferenceId en la orden (best-effort).
    if (writeClient && result.id) {
      try {
        await writeClient
          .patch(orderDocId(orderId))
          .set({ preferenceId: result.id })
          .commit();
      } catch {
        /* noop */
      }
    }

    return NextResponse.json({
      orderId,
      preferenceId: result.id,
      initPoint: result.init_point,
      sandboxInitPoint: result.sandbox_init_point,
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", issues: err.flatten() },
        { status: 400 },
      );
    }
    console.error("[checkout/preference]", err);
    const message =
      err instanceof Error ? err.message : "Error al iniciar el pago";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
