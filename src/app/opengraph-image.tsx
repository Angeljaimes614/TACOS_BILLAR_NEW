import { ImageResponse } from "next/og";
import { SITE_CONFIG } from "@/lib/constants";

export const runtime = "edge";

export const alt = `${SITE_CONFIG.name} · ${SITE_CONFIG.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "linear-gradient(135deg, #1f6b4f 0%, #124132 50%, #0e0d0b 100%)",
          color: "#f4ebd9",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 999,
              background: "linear-gradient(135deg, #d4ad6f 0%, #b8915a 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#22170d",
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            M
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              opacity: 0.9,
            }}
          >
            {SITE_CONFIG.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ fontSize: 28, opacity: 0.8 }}>{SITE_CONFIG.tagline}</div>
          <div
            style={{
              fontSize: 88,
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: "-0.02em",
              maxWidth: 940,
            }}
          >
            El taco perfecto te está esperando.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            opacity: 0.65,
            borderTop: "1px solid rgba(244,235,217,0.15)",
            paddingTop: 20,
          }}
        >
          <span>Predator · Mezz · McDermott · Aramith · Kamui</span>
          <span>maestrobillar.mx</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
