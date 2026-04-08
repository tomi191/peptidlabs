import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getPublishedBlogPosts } from "@/lib/queries";
import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterSignup } from "./NewsletterSignup";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return { title: t("title"), description: t("subtitle") };
}

function formatDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale === "bg" ? "bg-BG" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getExcerpt(content: string | null, maxLen = 150): string {
  if (!content) return "";
  const plain = content.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  if (plain.length <= maxLen) return plain;
  return plain.slice(0, maxLen).replace(/\s+\S*$/, "") + "...";
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

  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-16">
        <h1 className="text-3xl font-bold text-navy">{t("title")}</h1>
        <p className="mt-3 text-secondary">{t("subtitle")}</p>

        {posts.length === 0 ? (
          <div className="mt-10 max-w-md">
            <p className="text-sm text-muted mb-6">{t("noPosts")}</p>
            <div className="border border-border rounded-lg p-6">
              <p className="text-sm font-medium text-navy mb-4">
                {t("subscribePrompt")}
              </p>
              <NewsletterSignup />
            </div>
          </div>
        ) : (
          <>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                    className="border border-border rounded-lg p-6 hover:border-teal-600 transition-colors group flex flex-col"
                  >
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-medium text-muted"
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
                        <time className="text-xs text-muted">
                          {formatDate(post.published_at, locale)}
                        </time>
                      )}
                      <span className="text-xs font-medium text-teal-600 group-hover:text-teal-700 transition-colors">
                        {t("readMore")}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Newsletter section */}
            <div className="mt-16 border-t border-border pt-10 max-w-md">
              <div className="border border-border rounded-lg p-6">
                <p className="text-sm font-medium text-navy mb-4">
                  {t("subscribePrompt")}
                </p>
                <NewsletterSignup />
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
