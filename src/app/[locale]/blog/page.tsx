import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getPublishedBlogPosts } from "@/lib/queries";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { NewsletterSignup } from "./NewsletterSignup";
import { PageHero } from "@/components/layout/PageHero";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: `https://peptidlabs.eu/${locale}/blog`,
      languages: {
        bg: "https://peptidlabs.eu/bg/blog",
        en: "https://peptidlabs.eu/en/blog",
      },
    },
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

function getExcerpt(content: string | null, maxLen = 160): string {
  if (!content) return "";
  const plain = content.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  if (plain.length <= maxLen) return plain;
  return plain.slice(0, maxLen).replace(/\s+\S*$/, "") + "…";
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const posts = await getPublishedBlogPosts();
  const isBg = locale === "bg";

  // Collect all unique tags
  const tagSet = new Set<string>();
  posts.forEach((p) => (p.tags || []).forEach((t) => tagSet.add(t)));
  const allTags = Array.from(tagSet).slice(0, 8);

  return (
    <main className="flex-1 bg-white">
      <PageHero
        crumbs={[{ label: t("title") }]}
        title={t("title")}
        subtitle={t("subtitle")}
        locale={locale}
        aside={
          <div className="rounded-xl border border-teal-200 bg-teal-50/50 px-5 py-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-teal-700">
              {isBg ? "Статии" : "Articles"}
            </p>
            <p className="font-mono text-lg font-bold text-teal-700 mt-0.5 tabular">
              {posts.length}
            </p>
          </div>
        }
      />

      <div className="mx-auto max-w-[1280px] px-6 pb-16">
        {posts.length === 0 ? (
          <div className="max-w-md mx-auto">
            <p className="text-sm text-muted mb-6">{t("noPosts")}</p>
            <div className="border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Mail size={16} className="text-teal-600" />
                <p className="text-sm font-semibold text-navy">
                  {t("subscribePrompt")}
                </p>
              </div>
              <NewsletterSignup />
            </div>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_280px] lg:items-start">
            <div>
              <div className="grid gap-5 sm:grid-cols-2">
                {posts.map((post) => {
                  const title =
                    locale === "bg" ? post.title_bg : post.title_en;
                  const content =
                    locale === "bg" ? post.content_bg : post.content_en;
                  const excerpt = getExcerpt(content);

                  return (
                    <Link
                      key={post.id}
                      href={`/${locale}/blog/${post.slug}`}
                      className="group border border-border rounded-xl p-6 hover:border-navy/30 transition-colors bg-white flex flex-col"
                    >
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-surface px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <h2 className="text-base font-semibold text-navy group-hover:text-teal-600 transition-colors leading-snug">
                        {title}
                      </h2>

                      {excerpt && (
                        <p className="mt-2 text-sm text-secondary line-clamp-3 leading-relaxed">
                          {excerpt}
                        </p>
                      )}

                      <div className="mt-auto pt-4 flex items-center justify-between">
                        {post.published_at && (
                          <time className="font-mono text-[11px] text-muted tabular">
                            {formatDate(post.published_at, locale)}
                          </time>
                        )}
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-teal-600 group-hover:gap-2 transition-all">
                          {t("readMore")}
                          <ArrowRight size={12} strokeWidth={1.5} />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:sticky lg:top-24 space-y-4">
              {/* Tag cloud */}
              {allTags.length > 0 && (
                <div className="rounded-xl border border-border p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-3">
                    {isBg ? "Теми" : "Topics"}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {allTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-surface px-3 py-1 text-xs text-secondary border border-transparent hover:border-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter */}
              <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Mail size={16} className="text-teal-700" />
                  <p className="text-sm font-semibold text-teal-700">
                    {t("subscribePrompt")}
                  </p>
                </div>
                <p className="text-xs text-secondary mb-3 leading-relaxed">
                  {isBg
                    ? "Нови статии и научни публикации — веднъж месечно в пощата ви."
                    : "New articles and scientific publications — once a month in your inbox."}
                </p>
                <NewsletterSignup />
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
