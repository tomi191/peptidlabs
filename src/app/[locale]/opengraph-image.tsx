import { ImageResponse } from "next/og";

export const alt = "PeptidLabs — research-grade peptides from the EU";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default Open Graph card. Auto-applied to every page that does NOT define
 * its own `opengraph-image.tsx`. Renders the brand mark + tagline + a list
 * of trust signals on a dark navy background with teal accents.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #0f172a 0%, #0a1628 60%, #134e4a 100%)",
          color: "white",
          padding: 80,
          fontFamily: "Inter, sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle teal glow blob top-right */}
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -200,
            width: 600,
            height: 600,
            borderRadius: 600,
            background:
              "radial-gradient(circle, rgba(20,184,166,0.35), transparent 70%)",
          }}
        />

        {/* Brand mark + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="64" height="64" viewBox="0 0 64 64">
            <polygon
              points="32,10 50,21 50,43 32,54 14,43 14,21"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="32" cy="10" r="4" fill="#0f172a" stroke="#ffffff" strokeWidth="3" />
            <circle cx="50" cy="21" r="4" fill="#0f172a" stroke="#ffffff" strokeWidth="3" />
            <circle cx="50" cy="43" r="4" fill="#0f172a" stroke="#ffffff" strokeWidth="3" />
            <circle cx="14" cy="43" r="4" fill="#0f172a" stroke="#ffffff" strokeWidth="3" />
            <circle cx="32" cy="32" r="6" fill="#14b8a6" />
          </svg>
          <span
            style={{
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "0.18em",
            }}
          >
            PEPTIDLABS
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 80,
            maxWidth: 900,
          }}
        >
          <p
            style={{
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#5eead4",
              margin: 0,
            }}
          >
            Research-grade peptides
          </p>
          <h1
            style={{
              fontSize: 76,
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              marginTop: 14,
              marginBottom: 0,
            }}
          >
            HPLC-verified purity, EU-shipped, COA with every batch.
          </h1>
        </div>

        {/* Trust badges row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
            marginTop: "auto",
            fontSize: 22,
            color: "rgba(255,255,255,0.85)",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                background: "#14b8a6",
              }}
            />
            HPLC ≥ 98%
          </span>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>·</span>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                background: "#14b8a6",
              }}
            />
            COA per batch
          </span>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>·</span>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                background: "#14b8a6",
              }}
            />
            Shipped from EU 1–7 days
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
