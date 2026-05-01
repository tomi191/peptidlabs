import { ImageResponse } from "next/og";
import { createStaticSupabase } from "@/lib/supabase/static";

export const alt = "PeptidLabs peptide reference";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function PeptideOG({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const supabase = createStaticSupabase();
  const { data: peptide } = await supabase
    .from("peptides")
    .select("name, full_name_bg, full_name_en, summary_bg, summary_en, formula")
    .eq("slug", slug)
    .single();

  if (!peptide) {
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
          PeptidLabs Encyclopedia
        </div>
      ),
      { ...size },
    );
  }

  const isBg = locale === "bg";
  const fullName = isBg
    ? peptide.full_name_bg ?? peptide.full_name_en
    : peptide.full_name_en ?? peptide.full_name_bg;
  const summary = isBg
    ? peptide.summary_bg ?? peptide.summary_en
    : peptide.summary_en ?? peptide.summary_bg;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
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

        {/* Left: header + content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            paddingRight: 40,
          }}
        >
          {/* Brand mark */}
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
            <span style={{ color: "rgba(255,255,255,0.3)" }}>·</span>
            <span
              style={{
                fontSize: 18,
                color: "rgba(255,255,255,0.6)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              {isBg ? "Енциклопедия" : "Encyclopedia"}
            </span>
          </div>

          {/* Peptide name */}
          <div style={{ display: "flex", flexDirection: "column", marginTop: 70 }}>
            <h1
              style={{
                fontSize: 96,
                lineHeight: 1.0,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                margin: 0,
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {peptide.name}
            </h1>
            {fullName && (
              <p
                style={{
                  fontSize: 26,
                  color: "rgba(255,255,255,0.65)",
                  marginTop: 12,
                  marginBottom: 0,
                  lineHeight: 1.3,
                }}
              >
                {fullName}
              </p>
            )}
          </div>

          {/* Excerpt + formula */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "auto",
            }}
          >
            {summary && (
              <p
                style={{
                  fontSize: 22,
                  lineHeight: 1.4,
                  color: "rgba(255,255,255,0.78)",
                  margin: 0,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical" as const,
                  overflow: "hidden",
                  maxWidth: 720,
                }}
              >
                {summary.slice(0, 200) + (summary.length > 200 ? "..." : "")}
              </p>
            )}
            {peptide.formula && (
              <p
                style={{
                  fontSize: 18,
                  color: "rgba(94,234,212,0.85)",
                  fontFamily: "JetBrains Mono, monospace",
                  margin: 0,
                  marginTop: 16,
                }}
              >
                {peptide.formula}
              </p>
            )}
          </div>
        </div>

        {/* Right: hexagonal molecular mark accent */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 280,
          }}
        >
          <svg width="220" height="220" viewBox="0 0 64 64">
            <polygon
              points="32,10 50,21 50,43 32,54 14,43 14,21"
              fill="none"
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="32" cy="10" r="4" fill="#0f172a" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
            <circle cx="50" cy="21" r="4" fill="#0f172a" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
            <circle cx="50" cy="43" r="4" fill="#0f172a" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
            <circle cx="14" cy="43" r="4" fill="#0f172a" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
            <circle cx="14" cy="21" r="4" fill="#0f172a" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
            <circle cx="32" cy="54" r="4" fill="#0f172a" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
            <circle cx="32" cy="32" r="7" fill="#14b8a6" />
          </svg>
        </div>
      </div>
    ),
    { ...size },
  );
}
