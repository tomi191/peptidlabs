import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import {
  getPeptides,
  getPeptideBySlug,
  getProductsForPeptide,
} from "@/lib/queries";
import { createStaticSupabase } from "@/lib/supabase/static";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowRight, FileText, FlaskConical, Info, ShieldCheck } from "lucide-react";
import { SequenceVisual } from "@/components/peptide/SequenceVisual";
import { VialPlaceholder } from "@/components/ui/VialPlaceholder";
import { TextWithAbbr } from "@/components/ui/TextWithAbbr";
import { PageHero } from "@/components/layout/PageHero";
import { ResearchOnlyBanner } from "@/components/home/ResearchOnlyBanner";

export async function generateStaticParams() {
  const supabase = createStaticSupabase();
  const { data } = await supabase.from("peptides").select("slug");
  const slugs = (data ?? []).map((p) => p.slug);
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const peptide = await getPeptideBySlug(slug);
  if (!peptide) return {};
  const t = await getTranslations({ locale, namespace: "encyclopedia" });
  const fullName =
    locale === "bg"
      ? peptide.full_name_bg || peptide.full_name_en
      : peptide.full_name_en || peptide.full_name_bg;
  const summary =
    locale === "bg"
      ? peptide.summary_bg || peptide.summary_en
      : peptide.summary_en || peptide.summary_bg;
  return {
    title: `${peptide.name}${fullName ? ` — ${fullName}` : ""} | ${t("title")}`,
    description: summary || fullName || peptide.name,
  };
}

export default async function EncyclopediaDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("encyclopedia");
  const isBg = locale === "bg";

  const peptide = await getPeptideBySlug(slug);
  if (!peptide) notFound();

  const products = await getProductsForPeptide(slug);
  const allPeptides = await getPeptides();
  const related = allPeptides
    .filter((p) => p.id !== peptide.id)
    .slice(0, 6);

  const fullName = isBg
    ? peptide.full_name_bg || peptide.full_name_en
    : peptide.full_name_en || peptide.full_name_bg;

  const summary = isBg
    ? peptide.summary_bg || peptide.summary_en
    : peptide.summary_en || peptide.summary_bg;

  const mechanism = isBg
    ? peptide.mechanism_bg || peptide.mechanism_en
    : peptide.mechanism_en || peptide.mechanism_bg;

  // Lowest-priced product as primary CTA
  const primaryProduct = products[0];

  return (
    <main className="flex-1 bg-white">
      <ResearchOnlyBanner locale={locale as "bg" | "en"} />

      <PageHero
        crumbs={[
          { label: t("title"), href: "/encyclopedia" },
          { label: peptide.name },
        ]}
        title={peptide.name}
        subtitle={fullName ?? undefined}
        locale={locale}
        aside={
          <SequenceVisual
            sequence={peptide.formula || peptide.name}
            size={200}
          />
        }
      />

      <div className="mx-auto max-w-[1280px] px-6 pb-16">
        {/* Quick facts strip */}
        <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] text-muted border-y border-border py-3">
          <span className="inline-flex items-center gap-1.5">
            <FlaskConical size={14} />
            <TextWithAbbr
              text={isBg ? "HPLC чистота над 98%" : "HPLC purity above 98%"}
              locale={locale}
            />
          </span>
          {peptide.formula && (
            <span className="inline-flex items-center gap-1.5">
              <span className="opacity-60">{isBg ? "Формула:" : "Formula:"}</span>
              <span className="text-navy">{peptide.formula}</span>
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={14} />
            {isBg ? "Само за in vitro изследвания" : "For in vitro research only"}
          </span>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
          {/* MAIN COLUMN — 3-tier content */}
          <div className="space-y-12">
            {/* Tier 1 — Plain language */}
            {summary && (
              <section className="rounded-2xl bg-surface p-7 border border-border">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
                  {isBg ? "На обикновен език" : "In plain language"}
                </p>
                <h2 className="font-display text-xl font-bold text-navy mb-3 tracking-[-0.02em]">
                  {isBg
                    ? `Какво представлява ${peptide.name}`
                    : `What is ${peptide.name}`}
                </h2>
                <p className="text-secondary text-base leading-relaxed">
                  <TextWithAbbr text={summary} locale={locale} />
                </p>
              </section>
            )}

            {/* Tier 2 — Mechanism (scientific) */}
            {mechanism && (
              <section>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
                  {isBg ? "За изследователи" : "For researchers"}
                </p>
                <h2 className="font-display text-2xl font-bold text-navy mb-5 tracking-[-0.02em]">
                  {isBg ? "Механизъм на действие" : "Mechanism of action"}
                </h2>
                <div className="prose prose-sm max-w-none">
                  <p className="text-secondary leading-relaxed text-[15px]">
                    <TextWithAbbr text={mechanism} locale={locale} />
                  </p>
                </div>
              </section>
            )}

            {/* Tier 3 — PubMed references */}
            {peptide.research_links && peptide.research_links.length > 0 && (
              <section>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
                  {isBg ? "Научна литература" : "Scientific literature"}
                </p>
                <h2 className="font-display text-2xl font-bold text-navy mb-5 tracking-[-0.02em]">
                  {t("pubmedLinks")}
                </h2>
                <ul className="space-y-2">
                  {peptide.research_links.map((url, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-lg border border-border bg-white p-3 hover:border-navy/30 transition-colors"
                    >
                      <FileText
                        size={16}
                        className="text-accent shrink-0 mt-0.5"
                        strokeWidth={1.5}
                      />
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-secondary hover:text-navy break-all transition-colors"
                      >
                        {url}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Methodology / safety note */}
            <section className="rounded-xl border border-dashed border-border bg-surface/50 p-5">
              <div className="flex items-start gap-3">
                <Info size={16} className="text-muted shrink-0 mt-0.5" />
                <div className="text-xs text-muted leading-relaxed space-y-2">
                  <p>
                    {isBg
                      ? `Информацията за ${peptide.name} е базирана на публикувани научни проучвания и е предназначена за изследователски цели. Не е медицински съвет.`
                      : `Information about ${peptide.name} is based on published scientific research and is intended for research purposes. Not medical advice.`}
                  </p>
                  <p>
                    {isBg
                      ? "Продуктите, свързани с този пептид, са само за in vitro лабораторни изследвания. Не са одобрени за консумация от хора."
                      : "Products related to this peptide are for in vitro laboratory research only. Not approved for human consumption."}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* SIDEBAR — products + related */}
          <aside className="space-y-8 lg:sticky lg:top-24">
            {/* Products with this peptide */}
            {products.length > 0 && (
              <div className="rounded-2xl border border-border bg-white overflow-hidden">
                <div className="bg-navy px-5 py-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
                    {isBg ? "Налични продукти" : "Available products"}
                  </p>
                </div>
                <div className="divide-y divide-border">
                  {products.map((product) => {
                    const productName = isBg
                      ? product.name_bg || product.name
                      : product.name;
                    return (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        className="flex items-center gap-3 p-4 hover:bg-surface transition-colors"
                      >
                        <div className="shrink-0 flex h-14 w-10 items-center justify-center overflow-hidden rounded-md bg-surface">
                          <VialPlaceholder name={product.name} size="xs" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-navy truncate">
                            {productName}
                          </p>
                          {product.vial_size_mg && (
                            <p className="font-mono text-[11px] text-muted mt-0.5">
                              {product.vial_size_mg}mg · {product.purity_percent}%
                            </p>
                          )}
                        </div>
                        <p className="font-mono text-sm font-bold text-navy shrink-0 tabular">
                          €{product.price_eur.toFixed(2)}
                        </p>
                      </Link>
                    );
                  })}
                </div>
                {primaryProduct && (
                  <div className="border-t border-border bg-surface p-4">
                    <Link
                      href={`/products/${primaryProduct.slug}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy/90 transition-colors"
                    >
                      {isBg ? "Виж продуктовата страница" : "View product page"}
                      <ArrowRight size={14} />
                    </Link>
                    <p className="mt-2 text-[10px] text-muted text-center leading-relaxed">
                      {isBg
                        ? "Не е лекарствен — за in vitro изследвания"
                        : "Not a drug — for in vitro research"}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Quick stats */}
            <div className="rounded-2xl border border-border bg-surface/50 p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-4">
                {isBg ? "Бърз преглед" : "Quick reference"}
              </p>
              <dl className="space-y-3 text-sm">
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-muted">{isBg ? "Име" : "Name"}</dt>
                  <dd className="font-mono text-navy text-right">{peptide.name}</dd>
                </div>
                {fullName && (
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-muted shrink-0">
                      {isBg ? "Пълно име" : "Full name"}
                    </dt>
                    <dd className="text-navy text-right text-xs">{fullName}</dd>
                  </div>
                )}
                {peptide.formula && (
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-muted">
                      {isBg ? "Формула" : "Formula"}
                    </dt>
                    <dd className="font-mono text-navy text-right text-xs">
                      {peptide.formula}
                    </dd>
                  </div>
                )}
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-muted">
                    {isBg ? "Чистота" : "Purity"}
                  </dt>
                  <dd className="font-mono text-navy text-right">
                    {isBg ? "над 98%" : "above 98%"}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>

        {/* Related peptides */}
        {related.length > 0 && (
          <section className="mt-20 border-t border-border pt-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
              {isBg ? "Други пептиди" : "Other peptides"}
            </p>
            <h2 className="font-display text-2xl font-bold text-navy mb-8 tracking-[-0.02em]">
              {t("relatedPeptides")}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => {
                const rFullName = isBg
                  ? p.full_name_bg || p.full_name_en
                  : p.full_name_en || p.full_name_bg;
                const rSummary = isBg
                  ? p.summary_bg || p.summary_en
                  : p.summary_en || p.summary_bg;
                return (
                  <Link
                    key={p.id}
                    href={`/encyclopedia/${p.slug}`}
                    className="group border border-border rounded-xl p-5 hover:border-navy/30 hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.15)] transition-all bg-white"
                  >
                    <p className="font-mono text-sm font-semibold text-navy">
                      {p.name}
                    </p>
                    {rFullName && (
                      <p className="mt-1 text-xs text-muted line-clamp-1">
                        {rFullName}
                      </p>
                    )}
                    {rSummary && (
                      <p className="mt-3 text-xs text-secondary leading-relaxed line-clamp-3">
                        {rSummary}
                      </p>
                    )}
                    <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                      {isBg ? "Прочети" : "Read"}
                      <ArrowRight size={11} />
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
