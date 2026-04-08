import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getBlogPostBySlug, getBlogPostProducts } from "@/lib/queries";
import { createStaticSupabase } from "@/lib/supabase/static";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import Link from "next/link";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const supabase = createStaticSupabase();
  const { data } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("status", "published");
  const slugs = (data ?? []).map((p) => p.slug);
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};

  const title = locale === "bg" ? post.title_bg : post.title_en;
  const content = locale === "bg" ? post.content_bg : post.content_en;
  const description = content
    ? content.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").slice(0, 160)
    : title;

  return {
    title: `${title} | PeptideLab`,
    description,
  };
}

function formatDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale === "bg" ? "bg-BG" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Renders plain text content with paragraph breaks and inline markdown links. */
function renderContent(content: string, locale: string) {
  const paragraphs = content.split(/\n\n+/);

  return paragraphs.map((para, i) => {
    const trimmed = para.trim();
    if (!trimmed) return null;

    // Detect heading-like lines (short, no period, no link, start of section)
    const isHeading =
      trimmed.length < 120 &&
      !trimmed.includes(".") &&
      !trimmed.startsWith("-") &&
      !trimmed.startsWith("[") &&
      !trimmed.match(/^\d+\./);

    const isListSection = trimmed.includes("\n") && trimmed.split("\n").every(line => {
      const l = line.trim();
      return l === "" || l.startsWith("-") || l.startsWith("*");
    });

    // Convert markdown links to HTML
    const withLinks = trimmed.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (_match, text, href) => {
        return `<a href="${href}" class="text-teal-600 hover:underline">${text}</a>`;
      }
    );

    if (isHeading) {
      return (
        <h2
          key={i}
          className="text-lg font-semibold text-navy mt-8 mb-3"
          dangerouslySetInnerHTML={{ __html: withLinks }}
        />
      );
    }

    if (isListSection) {
      const lines = trimmed.split("\n").filter(l => l.trim());
      return (
        <ul key={i} className="list-disc list-inside space-y-1 text-secondary leading-relaxed">
          {lines.map((line, j) => {
            const clean = line.replace(/^[-*]\s*/, "");
            const lineWithLinks = clean.replace(
              /\[([^\]]+)\]\(([^)]+)\)/g,
              (_match: string, text: string, href: string) =>
                `<a href="${href}" class="text-teal-600 hover:underline">${text}</a>`
            );
            return (
              <li
                key={j}
                dangerouslySetInnerHTML={{ __html: lineWithLinks }}
              />
            );
          })}
        </ul>
      );
    }

    return (
      <p
        key={i}
        className="text-secondary leading-relaxed"
        dangerouslySetInnerHTML={{ __html: withLinks }}
      />
    );
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");

  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const products = await getBlogPostProducts(post.id);

  const title = locale === "bg" ? post.title_bg : post.title_en;
  const content = locale === "bg" ? post.content_bg : post.content_en;

  // Article JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    datePublished: post.published_at,
    author: {
      "@type": "Organization",
      name: post.author || "PeptideLab",
    },
    publisher: {
      "@type": "Organization",
      name: "PeptideLab",
      url: "https://peptidelab.bg",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-[1280px] px-6 py-16">
          {/* Breadcrumb */}
          <nav className="text-xs text-muted mb-8">
            <Link
              href={`/${locale}/blog`}
              className="hover:text-teal-600 transition-colors"
            >
              {t("backToBlog")}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-navy">{title}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
            {/* Main content */}
            <article>
              <h1 className="text-2xl font-bold text-navy leading-tight">
                {title}
              </h1>

              {/* Meta line */}
              <div className="mt-3 flex items-center gap-3 text-xs text-muted">
                {post.published_at && (
                  <time>{formatDate(post.published_at, locale)}</time>
                )}
                {post.author && (
                  <>
                    <span aria-hidden="true">|</span>
                    <span>{post.author}</span>
                  </>
                )}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-surface px-2.5 py-0.5 text-[11px] font-medium text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Content */}
              {content && (
                <div className="mt-8 space-y-4 text-sm">
                  {renderContent(content, locale)}
                </div>
              )}
            </article>

            {/* Sidebar — related products */}
            {products.length > 0 && (
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <h2 className="text-sm font-semibold text-navy mb-4">
                    {t("relatedProducts")}
                  </h2>
                  <div className="space-y-3">
                    {products.map((product) => (
                      <Link
                        key={product.id}
                        href={`/${locale}/products/${product.slug}`}
                        className="block border border-border rounded-lg p-4 hover:border-teal-600 transition-colors"
                      >
                        <p className="text-sm font-medium text-navy">
                          {product.name}
                        </p>
                        {product.vial_size_mg && (
                          <p className="font-mono text-xs text-muted mt-1">
                            {product.vial_size_mg}mg
                          </p>
                        )}
                        <p className="font-mono text-sm text-teal-600 mt-1">
                          &euro;{product.price_eur.toFixed(2)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
