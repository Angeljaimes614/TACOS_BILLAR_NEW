import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { revalidateSecret } from "@/sanity/env";

interface SanityWebhookPayload {
  _type?: string;
  _id?: string;
  slug?: { current?: string };
}

/**
 * Endpoint para webhooks GROQ de Sanity.
 *
 * Configurar en Sanity → API → Webhooks:
 *   - URL: https://<dominio>/api/revalidate
 *   - Dataset: production
 *   - Trigger: Create / Update / Delete
 *   - Filter: _type in ["product", "category", "brand", "promotion"]
 *   - Projection: { _type, _id, "slug": slug }
 *   - Secret: el valor de SANITY_REVALIDATE_SECRET
 */
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<SanityWebhookPayload>(
      req,
      revalidateSecret,
    );

    if (!isValidSignature) {
      return new NextResponse("Firma inválida", { status: 401 });
    }
    if (!body?._type) {
      return new NextResponse("Falta _type en el payload", { status: 400 });
    }

    revalidateTag(body._type);

    return NextResponse.json({
      revalidated: true,
      type: body._type,
      now: Date.now(),
    });
  } catch (err) {
    console.error("[revalidate] error:", err);
    const message = err instanceof Error ? err.message : "Error desconocido";
    return new NextResponse(message, { status: 500 });
  }
}
