import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getPublishedBlogPosts } from "@/lib/queries";
import type { Metadata } from "next";
import { Mail, BookOpen } from "lucide-react";
import { NewsletterSignup } from "./NewsletterSignup";
import { PageHero } from "@/components/layout/PageHero";
import { BlogClient, type BlogClientPost } from "./BlogClient";

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

const FRESH_THRESHOLD_DAYS = 21;
const WORDS_PER_MINUTE = 220;

function getExcerpt(content: string | null, maxLen = 200): string {
  if (!content) return "";
  // Strip markdown syntax for cleaner preview
  const plain = content
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links
    .replace(/[#*_`>]/g, "") // markdown chars
    .replace(/\n+/g, " ") // newlines → space
    .trim();
  if (plain.length <= maxLen) return plain;
  return plain.slice(0, maxLen).replace(/\s+\S*$/, "") + "…";
}

function getReadMinutes(content: string | null): number {
  if (!content) return 1;
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function isFresh(publishedAt: string | null): boolean {
  if (!publishedAt) return false;
  const days =
    (Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60 * 24);
  return days >= 0 && days <= FRESH_THRESHOLD_DAYS;
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
  const loc = (locale === "bg" ? "bg" : "en") as "bg" | "en";

  // Map DB posts → client-friendly shape
  const clientPosts: BlogClientPost[] = posts.map((p) => {
    const title = isBg ? p.title_bg : p.title_en;
    const content = isBg ? p.content_bg : p.content_en;
    return {
      id: p.id,
      slug: p.slug,
      title,
      excerpt: getExcerpt(content),
      tags: p.tags ?? [],
      publishedAt: p.published_at,
      author: p.author,
      readMinutes: getReadMinutes(content),
      isFresh: isFresh(p.published_at),
    };
  });

  // Top tags by frequency, capped to 5 (PillNav stays uncluttered)
  const tagCounts = new Map<string, number>();
  clientPosts.forEach((p) =>
    p.tags.forEach((tag) =>
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1),
    ),
  );
  const topTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag);

  return (
    <main className="flex-1 bg-white">
      <PageHero
        crumbs={[{ label: t("title") }]}
        title={t("title")}
        subtitle={t("subtitle")}
        locale={locale}
        aside={
          <div className="inline-flex items-center gap-3 rounded-2xl border border-accent-border bg-accent-tint/60 px-4 py-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white ring-1 ring-accent-border">
              <BookOpen size={16} strokeWidth={1.8} className="text-teal-700" />
            </span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-teal-700">
                {t("articles")}
              </p>
              <p className="font-mono text-lg font-bold tabular text-teal-700">
                {posts.length}
              </p>
            </div>
          </div>
        }
      />

      {posts.length === 0 ? (
        <div className="mx-auto max-w-md px-6 pb-20">
          <div className="rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
            <span className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-tint ring-1 ring-accent-border">
              <Mail size={20} strokeWidth={1.6} className="text-teal-700" />
            </span>
            <p className="text-sm text-secondary">{t("noPosts")}</p>
            <p className="mt-2 text-sm font-semibold text-navy">
              {t("subscribePrompt")}
            </p>
            <div className="mt-5">
              <NewsletterSignup />
            </div>
          </div>
        </div>
      ) : (
        <BlogClient
          posts={clientPosts}
          topTags={topTags}
          locale={loc}
          i18n={{
            featured: t("featured"),
            filterAll: t("filterAll"),
            filterEmpty: t("filterEmpty"),
            readMore: t("readMore"),
            minRead: t("minRead"),
            newest: t("newest"),
            newsletterTitle: t("newsletterTitle"),
            newsletterSubtitle: t("newsletterSubtitle"),
            subscribePrompt: t("subscribePrompt"),
            byline: t("byline"),
            articles: t("articles"),
            newsletterLabel: "Newsletter",
            trust1: isBg ? "1 имейл / месец" : "1 email / month",
            trust2: isBg ? "Отписване с 1 клик" : "1-click unsubscribe",
            trust3: isBg ? "Без спам" : "No spam",
          }}
        />
      )}
    </main>
  );
}
