import { ImageResponse } from "next/og";
import { createStaticSupabase } from "@/lib/supabase/static";

export const alt = "PeptidLabs blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export default async function BlogOG({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const supabase = createStaticSupabase();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title_bg, title_en, published_at, author")
    .eq("slug", slug)
    .single();

  if (!post) {
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
          PeptidLabs Blog
        </div>
      ),
      { ...size },
    );
  }

  const isBg = locale === "bg";
  const title = isBg && post.title_bg ? post.title_bg : post.title_en;
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString(
        locale === "bg" ? "bg-BG" : "en-GB",
        { year: "numeric", month: "long", day: "numeric" },
      )
    : "";

  // Use the existing KIE-generated blog cover as backdrop if it exists
  const coverUrl = SUPABASE_URL
    ? `${SUPABASE_URL}/storage/v1/object/public/product-images/blog/${slug}.png`
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0f172a",
          color: "white",
          fontFamily: "Inter, sans-serif",
          position: "relative",
        }}
      >
        {/* Cover image as faded backdrop */}
        {coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt=""
            width={1200}
            height={630}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.45,
            }}
          />
        )}
        {/* Dark gradient overlay for text legibility */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.55) 60%, rgba(20,184,166,0.18) 100%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            padding: 80,
            flex: 1,
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
                color: "rgba(255,255,255,0.7)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              {isBg ? "Блог" : "Blog"}
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: 68,
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginTop: 80,
              marginBottom: 0,
              maxWidth: 1000,
            }}
          >
            {title}
          </h1>

          {/* Footer meta */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: "auto",
              fontSize: 22,
              color: "rgba(255,255,255,0.85)",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            {date && <span>{date}</span>}
            {post.author && (
              <>
                <span style={{ color: "rgba(255,255,255,0.3)" }}>·</span>
                <span>{post.author}</span>
              </>
            )}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
