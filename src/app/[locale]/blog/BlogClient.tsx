"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Sparkles,
  Clock,
  CalendarDays,
  Newspaper,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ShinyText } from "@/components/ui/ShinyText";
import { Magnet } from "@/components/ui/Magnet";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { TiltedCard } from "@/components/ui/TiltedCard";
import { PillNav } from "@/components/ui/PillNav";
import { NewsletterSignup } from "./NewsletterSignup";

export type BlogClientPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  publishedAt: string | null;
  author: string | null;
  readMinutes: number;
  isFresh: boolean;
};

type Props = {
  posts: BlogClientPost[];
  topTags: string[];
  locale: "bg" | "en";
  i18n: {
    featured: string;
    filterAll: string;
    filterEmpty: string;
    readMore: string;
    minRead: string;
    newest: string;
    newsletterTitle: string;
    newsletterSubtitle: string;
    subscribePrompt: string;
    byline: string;
    articles: string;
    newsletterLabel: string;
    trust1: string;
    trust2: string;
    trust3: string;
  };
};

function formatDate(dateStr: string, locale: "bg" | "en"): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale === "bg" ? "bg-BG" : "en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function BlogClient({ posts, topTags, locale, i18n }: Props) {
  const [activeTag, setActiveTag] = useState<string>("__all__");

  // Build tag counts for badges
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((p) =>
      p.tags.forEach((t) => {
        counts[t] = (counts[t] ?? 0) + 1;
      }),
    );
    return counts;
  }, [posts]);

  const filtered = useMemo(() => {
    if (activeTag === "__all__") return posts;
    return posts.filter((p) => p.tags.includes(activeTag));
  }, [posts, activeTag]);

  const pillItems = useMemo(
    () => [
      {
        key: "__all__",
        label: i18n.filterAll,
        badge: posts.length,
      },
      ...topTags.map((t) => ({
        key: t,
        label: t,
        badge: tagCounts[t] ?? 0,
      })),
    ],
    [topTags, posts.length, tagCounts, i18n.filterAll],
  );

  const featured = filtered[0];
  const secondary = filtered.slice(1, 3);
  const rest = filtered.slice(3);

  return (
    <section className="mx-auto max-w-[1280px] px-6 pb-20">
      {/* Filter pills */}
      {posts.length > 0 && (
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <PillNav
            layoutId="blog-tag-filter"
            items={pillItems}
            active={activeTag}
            onChange={setActiveTag}
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyTagState message={i18n.filterEmpty} />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTag}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="space-y-12"
          >
            {/* Bento — featured + 2 secondary */}
            {featured && (
              <div className="grid gap-5 lg:grid-cols-5">
                <FeaturedCard
                  post={featured}
                  locale={locale}
                  i18n={i18n}
                  className="lg:col-span-3"
                />
                <div className="grid gap-5 lg:col-span-2">
                  {secondary.map((post) => (
                    <SecondaryCard
                      key={post.id}
                      post={post}
                      locale={locale}
                      i18n={i18n}
                    />
                  ))}
                  {/* Fill empty slot when there are not enough secondary posts */}
                  {secondary.length < 2 &&
                    Array.from({ length: 2 - secondary.length }).map(
                      (_, idx) => <FillerTile key={`filler-${idx}`} />,
                    )}
                </div>
              </div>
            )}

            {/* Rest grid */}
            {rest.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    locale={locale}
                    i18n={i18n}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Newsletter — full-width premium block */}
      <NewsletterBlock
        title={i18n.newsletterTitle}
        subtitle={i18n.newsletterSubtitle}
        byline={i18n.byline}
        label={i18n.newsletterLabel}
        trust={[i18n.trust1, i18n.trust2, i18n.trust3]}
      />
    </section>
  );
}

/* ─────────────── Featured (large bento tile) ─────────────── */

function FeaturedCard({
  post,
  locale,
  i18n,
  className = "",
}: {
  post: BlogClientPost;
  locale: "bg" | "en";
  i18n: Props["i18n"];
  className?: string;
}) {
  return (
    <TiltedCard intensity={2.5} className={`relative ${className}`}>
      <Link
        href={`/${locale}/blog/${post.slug}`}
        className="group relative block h-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-navy via-[#0a1628] to-navy p-7 text-white sm:p-9"
      >
        {/* Decorative grid pattern */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage:
              "radial-gradient(ellipse at top right, black 10%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at top right, black 10%, transparent 70%)",
          }}
        />
        {/* Teal glow blob — single, small, scientific */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-500/30 blur-3xl"
        />

        <div className="relative flex h-full flex-col">
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-400/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-teal-200 ring-1 ring-teal-400/30">
              <Sparkles size={11} strokeWidth={2} />
              {i18n.featured}
            </span>
            {post.isFresh && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white/80 ring-1 ring-white/15">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-300 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal-300" />
                </span>
                {i18n.newest}
              </span>
            )}
          </div>

          <h2 className="font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
            <ShinyText color="#ffffff" shine="rgba(94, 234, 212, 1)" speed={6}>
              {post.title}
            </ShinyText>
          </h2>

          {post.excerpt && (
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/75">
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {post.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white/70 ring-1 ring-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer meta */}
          <div className="mt-auto flex items-center justify-between pt-8">
            <div className="flex items-center gap-4 font-mono text-[11px] text-white/60">
              {post.publishedAt && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={12} strokeWidth={1.6} />
                  <time className="tabular">
                    {formatDate(post.publishedAt, locale)}
                  </time>
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Clock size={12} strokeWidth={1.6} />
                <span className="tabular">
                  {post.readMinutes} {i18n.minRead}
                </span>
              </span>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-navy transition-transform group-hover:translate-x-1">
              {i18n.readMore}
              <ArrowUpRight size={14} strokeWidth={2} />
            </span>
          </div>
        </div>
      </Link>
    </TiltedCard>
  );
}

/* ─────────────── Secondary (right column of bento) ─────────────── */

function SecondaryCard({
  post,
  locale,
  i18n,
}: {
  post: BlogClientPost;
  locale: "bg" | "en";
  i18n: Props["i18n"];
}) {
  return (
    <SpotlightCard
      radius={220}
      opacity={0.22}
      color="rgba(13, 148, 136, 1)"
      className="h-full rounded-2xl"
    >
      <Link
        href={`/${locale}/blog/${post.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white p-6 transition-colors hover:border-teal-300/60"
      >
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-accent-tint px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-teal-700 ring-1 ring-accent-border"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h3 className="font-display text-lg font-semibold leading-snug text-navy transition-colors group-hover:text-teal-700">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-secondary">
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-5">
          <div className="flex items-center gap-3 font-mono text-[10px] text-muted">
            {post.publishedAt && (
              <time className="tabular">
                {formatDate(post.publishedAt, locale)}
              </time>
            )}
            <span aria-hidden="true">·</span>
            <span className="tabular">
              {post.readMinutes} {i18n.minRead}
            </span>
          </div>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface text-navy transition-colors group-hover:bg-navy group-hover:text-white">
            <ArrowUpRight size={14} strokeWidth={2} />
          </span>
        </div>
      </Link>
    </SpotlightCard>
  );
}

/* ─────────────── Standard post card (rest grid) ─────────────── */

function PostCard({
  post,
  locale,
  i18n,
}: {
  post: BlogClientPost;
  locale: "bg" | "en";
  i18n: Props["i18n"];
}) {
  return (
    <SpotlightCard
      radius={180}
      opacity={0.2}
      color="rgba(13, 148, 136, 1)"
      className="h-full rounded-2xl"
    >
      <Link
        href={`/${locale}/blog/${post.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white p-6 transition-colors hover:border-teal-300/60"
      >
        {post.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-secondary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h3 className="font-display text-base font-semibold leading-snug text-navy transition-colors group-hover:text-teal-700">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-secondary">
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-5">
          <div className="flex items-center gap-2 font-mono text-[10px] text-muted">
            {post.publishedAt && (
              <time className="tabular">
                {formatDate(post.publishedAt, locale)}
              </time>
            )}
            <span aria-hidden="true">·</span>
            <span className="tabular">
              {post.readMinutes} {i18n.minRead}
            </span>
          </div>
          <Magnet strength={0.4} radius={50}>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-teal-700">
              {i18n.readMore}
              <ArrowUpRight
                size={12}
                strokeWidth={2}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </Magnet>
        </div>
      </Link>
    </SpotlightCard>
  );
}

/* ─────────────── Filler tile when fewer than 2 secondary posts ─────────────── */

function FillerTile() {
  return (
    <div
      aria-hidden="true"
      className="relative h-full min-h-[180px] overflow-hidden rounded-2xl border border-dashed border-border bg-surface/50"
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(13, 148, 136, 0.12), transparent 50%), radial-gradient(circle at 80% 70%, rgba(15, 23, 42, 0.06), transparent 60%)",
        }}
      />
      <div className="relative flex h-full items-center justify-center">
        <Newspaper
          size={28}
          strokeWidth={1.2}
          className="text-muted/60"
        />
      </div>
    </div>
  );
}

/* ─────────────── Empty (no posts in active tag) ─────────────── */

function EmptyTagState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface/60 px-8 py-16 text-center">
      <Newspaper
        size={32}
        strokeWidth={1.4}
        className="mx-auto text-muted"
      />
      <p className="mt-4 text-sm text-secondary">{message}</p>
    </div>
  );
}

/* ─────────────── Newsletter — full-width premium block ─────────────── */

function NewsletterBlock({
  title,
  subtitle,
  byline,
  label,
  trust,
}: {
  title: string;
  subtitle: string;
  byline: string;
  label: string;
  trust: [string, string, string];
}) {
  return (
    <div className="relative mt-20 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface via-white to-accent-tint/40">
      {/* Decorative dotted grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(13, 148, 136, 0.18) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          maskImage:
            "radial-gradient(ellipse at center, black 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 0%, transparent 70%)",
        }}
      />

      <div className="relative grid gap-8 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-12">
        <div>
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-teal-700 ring-1 ring-accent-border">
            <Mail size={11} strokeWidth={2} />
            {label}
          </div>

          <h2 className="font-display text-2xl font-bold leading-tight tracking-tight text-navy sm:text-3xl">
            <ShinyText speed={6}>{title}</ShinyText>
          </h2>

          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-secondary">
            {subtitle}
          </p>

          <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted">
            — {byline}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white/80 p-5 shadow-sm backdrop-blur-sm sm:p-6">
          <NewsletterSignup />
          <p className="mt-3 text-[11px] leading-relaxed text-muted">
            <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
              <Dot /> {trust[0]}
              <Dot /> {trust[1]}
              <Dot /> {trust[2]}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Dot() {
  return <span className="h-1 w-1 rounded-full bg-muted/60" aria-hidden="true" />;
}
