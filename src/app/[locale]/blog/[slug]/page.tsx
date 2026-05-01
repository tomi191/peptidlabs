import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getBlogPostBySlug, getBlogPostProducts } from "@/lib/queries";
import { createStaticSupabase } from "@/lib/supabase/static";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { buildMetadata } from "@/lib/seo/schema";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

// Extended sanitize schema — allow links with href + target + rel
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    a: [
      ...(defaultSchema.attributes?.a ?? []),
      ["target"],
      ["rel"],
    ],
  },
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

  return buildMetadata({
    title: `${title} | PeptidLabs`,
    description,
    path: `/${locale}/blog/${slug}`,
    locale,
  });
}

function formatDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale === "bg" ? "bg-BG" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
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
      name: post.author || "PeptidLabs",
    },
    publisher: {
      "@type": "Organization",
      name: "PeptidLabs",
      url: "https://peptidlabs.eu",
    },
  };

  return (
    <>
      {/* Article JSON-LD is schema.org structured data, not user HTML — safe. */}
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
              className="hover:text-accent transition-colors"
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

              {/* Content — markdown parsed via AST + sanitized */}
              {content && (
                <div className="mt-8 prose prose-neutral max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[[rehypeSanitize, sanitizeSchema]]}
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-2xl font-bold text-navy mt-8 mb-3">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xl font-semibold text-navy mt-6 mb-2">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-lg font-semibold text-navy mt-4 mb-2">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="text-sm text-secondary leading-relaxed mb-4">
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc pl-6 mb-4 text-sm text-secondary space-y-1">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal pl-6 mb-4 text-sm text-secondary space-y-1">
                          {children}
                        </ol>
                      ),
                      a: ({ href, children }) => {
                        const isExternal = href?.startsWith("http");
                        return (
                          <a
                            href={href}
                            className="text-accent underline underline-offset-2 hover:text-navy"
                            target={isExternal ? "_blank" : undefined}
                            rel={isExternal ? "noopener noreferrer" : undefined}
                          >
                            {children}
                          </a>
                        );
                      },
                      strong: ({ children }) => (
                        <strong className="font-semibold text-navy">
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic">{children}</em>
                      ),
                      code: ({ children }) => (
                        <code className="font-mono text-xs bg-surface px-1.5 py-0.5 rounded">
                          {children}
                        </code>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-2 border-border pl-4 italic text-secondary my-4">
                          {children}
                        </blockquote>
                      ),
                    }}
                  >
                    {content}
                  </ReactMarkdown>
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
                        className="block border border-border rounded-lg p-4 hover:border-accent transition-colors"
                      >
                        <p className="text-sm font-medium text-navy">
                          {product.name}
                        </p>
                        {product.vial_size_mg && (
                          <p className="font-mono text-xs text-muted mt-1">
                            {product.vial_size_mg}mg
                          </p>
                        )}
                        <p className="font-mono text-sm text-accent mt-1 leading-tight">
                          &euro;{product.price_eur.toFixed(2)}
                          <span className="block text-[10px] text-muted">
                            &asymp; {(product.price_eur * 1.95583).toFixed(2)} лв
                          </span>
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
