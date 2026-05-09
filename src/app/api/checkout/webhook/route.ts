import { NextResponse, type NextRequest } from "next/server";
import { Payment } from "mercadopago";
import { getMpClient } from "@/lib/checkout/mercadopago";
import { verifyMercadoPagoSignature } from "@/lib/checkout/verify-webhook";
import { orderDocId, tryGetWriteClient } from "@/sanity/lib/server-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type OrderStatus = "pending" | "approved" | "rejected" | "cancelled" | "refunded";

function mapMpStatus(status?: string | null): OrderStatus {
  switch (status) {
    case "approved":
      return "approved";
    case "rejected":
      return "rejected";
    case "cancelled":
      return "cancelled";
    case "refunded":
    case "charged_back":
      return "refunded";
    default:
      return "pending";
  }
}

interface OrderItem {
  productId?: string;
  quantity?: number;
}

/**
 * Webhook IPN de Mercado Pago.
 *
 * Si el webhook secret está configurado se valida la firma HMAC.
 * Cuando un pago queda "approved" decrementamos el stock de cada producto
 * de forma transaccional (Sanity transaction).
 */
export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const dataId =
      url.searchParams.get("data.id") ?? url.searchParams.get("id");
    const signature = req.headers.get("x-signature");
    const requestId = req.headers.get("x-request-id");
    const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;

    if (secret) {
      const ok = verifyMercadoPagoSignature({
        signature,
        requestId,
        dataId,
        secret,
      });
      if (!ok) {
        console.warn("[mp webhook] firma inválida", { dataId, requestId });
        return new NextResponse("Invalid signature", { status: 401 });
      }
    } else if (process.env.NODE_ENV === "production") {
      console.error("[mp webhook] MERCADOPAGO_WEBHOOK_SECRET no configurado en producción");
      return new NextResponse("Webhook secret not configured", { status: 500 });
    }

    const body = await req.json().catch(() => ({}));

    const isPaymentEvent =
      body?.type === "payment" || body?.topic === "payment";

    if (!isPaymentEvent || !body?.data?.id) {
      return NextResponse.json({ received: true, skipped: true });
    }

    const payment = new Payment(getMpClient());
    const detail = await payment.get({ id: String(body.data.id) });

    const orderId = detail.external_reference ?? null;
    const newStatus = mapMpStatus(detail.status);

    console.log("[mp webhook] payment", {
      paymentId: detail.id,
      status: detail.status,
      mappedStatus: newStatus,
      orderId,
      amount: detail.transaction_amount,
    });

    if (!orderId) {
      return NextResponse.json({ received: true, warning: "missing external_reference" });
    }

    const writeClient = tryGetWriteClient();
    if (!writeClient) {
      // Sin token de escritura: log-only.
      return NextResponse.json({ received: true, persisted: false });
    }

    const docId = orderDocId(orderId);

    // Leemos el estado anterior para evitar decrementar stock dos veces si
    // el webhook se reintenta y la orden ya está aprobada.
    const previous = await writeClient.fetch<{
      status?: OrderStatus;
      items?: OrderItem[];
    } | null>(`*[_type == "order" && _id == $id][0]{ status, items[]{ productId, quantity } }`, {
      id: docId,
    });

    await writeClient
      .patch(docId)
      .setIfMissing({ orderId })
      .set({
        status: newStatus,
        paymentId: String(detail.id),
        paidAt:
          newStatus === "approved" ? new Date().toISOString() : null,
      })
      .commit({ autoGenerateArrayKeys: true });

    // Decrementar stock sólo en la transición pending → approved.
    if (
      newStatus === "approved" &&
      previous?.status !== "approved" &&
      previous?.items?.length
    ) {
      const tx = writeClient.transaction();
      for (const item of previous.items) {
        if (!item.productId || !item.quantity) continue;
        tx.patch(item.productId, (p) =>
          p.dec({ stock: item.quantity ?? 0 }).setIfMissing({ stock: 0 }),
        );
      }
      try {
        await tx.commit();
      } catch (err) {
        console.error("[mp webhook] error decrementando stock:", err);
      }
    }

    return NextResponse.json({ received: true, persisted: true });
  } catch (err) {
    console.error("[mp webhook]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
