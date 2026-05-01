import { ImageResponse } from "next/og";
import { createStaticSupabase } from "@/lib/supabase/static";

export const alt = "PeptidLabs product";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Per-product Open Graph card. Shows product name, dose, form, purity,
 * price in EUR + the brand mark on a navy gradient background.
 */
export default async function ProductOG({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const supabase = createStaticSupabase();
  const { data: product } = await supabase
    .from("products")
    .select(
      "name, name_bg, vial_size_mg, form, purity_percent, price_eur, use_case_tag_bg, use_case_tag_en",
    )
    .eq("slug", slug)
    .single();

  if (!product) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0f172a",
            color: "white",
            fontSize: 48,
          }}
        >
          PeptidLabs
        </div>
      ),
      { ...size },
    );
  }

  const isBg = locale === "bg";
  const displayName = isBg && product.name_bg ? product.name_bg : product.name;
  const tag = isBg ? product.use_case_tag_bg : product.use_case_tag_en;
  const formLabel: Record<string, string> = {
    lyophilized: isBg ? "Лиофилизиран" : "Lyophilized",
    solution: isBg ? "Разтвор" : "Solution",
    nasal_spray: isBg ? "Назален спрей" : "Nasal spray",
    capsule: isBg ? "Капсули" : "Capsule",
    accessory: isBg ? "Аксесоар" : "Accessory",
  };

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
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="48" height="48" viewBox="0 0 64 64">
            <polygon
              points="32,10 50,21 50,43 32,54 14,43 14,21"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="32" cy="32" r="6" fill="#14b8a6" />
          </svg>
          <span
            style={{
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "0.18em",
            }}
          >
            PEPTIDLABS
          </span>
        </div>

        {/* Tag pill + product name */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 90,
            maxWidth: 1000,
          }}
        >
          {tag && (
            <span
              style={{
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#5eead4",
                margin: 0,
              }}
            >
              {tag}
            </span>
          )}
          <h1
            style={{
              fontSize: 88,
              lineHeight: 1.0,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              marginTop: 14,
              marginBottom: 0,
            }}
          >
            {displayName}
          </h1>
        </div>

        {/* Specs row + price */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginTop: "auto",
            color: "rgba(255,255,255,0.85)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              fontSize: 24,
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            {product.vial_size_mg && (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {product.vial_size_mg}mg
              </span>
            )}
            {product.form && (
              <>
                <span style={{ color: "rgba(255,255,255,0.3)" }}>·</span>
                <span>{formLabel[product.form] ?? product.form}</span>
              </>
            )}
            <span style={{ color: "rgba(255,255,255,0.3)" }}>·</span>
            <span>{product.purity_percent}% HPLC</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <span
              style={{
                fontSize: 20,
                color: "rgba(255,255,255,0.55)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              {isBg ? "Цена" : "Price"}
            </span>
            <span
              style={{
                fontSize: 64,
                fontWeight: 700,
                color: "white",
                fontFamily: "JetBrains Mono, monospace",
                letterSpacing: "-0.02em",
              }}
            >
              €{product.price_eur.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
