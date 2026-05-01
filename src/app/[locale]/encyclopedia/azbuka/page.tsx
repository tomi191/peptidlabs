import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getPeptides } from "@/lib/queries";
import { PageHero } from "@/components/layout/PageHero";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo/schema";
import { ArrowUpRight } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isBg = locale === "bg";
  return buildMetadata({
    title: isBg
      ? "Азбучен указател на пептиди — пълен списък | Енциклопедия"
      : "Peptide A–Z Index — full alphabetical list | Encyclopedia",
    description: isBg
      ? "Алфабетен указател на всички пептиди в енциклопедията — A до Я с латински и кирилски заглавия. Бърза навигация по първа буква."
      : "Alphabetical index of every peptide in the encyclopedia — A to Z with Latin and Cyrillic names. Quick first-letter navigation.",
    path: `/${locale}/encyclopedia/azbuka`,
    locale,
  });
}

const LATIN_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const CYRILLIC_LETTERS = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЬЮЯ".split("");

function bucketKey(name: string): string {
  if (!name) return "#";
  const first = name.charAt(0).toUpperCase();
  if (CYRILLIC_LETTERS.includes(first)) return first;
  if (LATIN_LETTERS.includes(first)) return first;
  // Numeric / punctuation prefixes (e.g. 5-Amino-1MQ) → "#"
  return "#";
}

export default async function AzbukaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("encyclopedia");
  const isBg = locale === "bg";

  const peptides = await getPeptides();

  // Bucket by first letter — use Latin (peptide.name) for Latin slugs,
  // Cyrillic (peptide.full_name_bg) for Cyrillic if BG locale.
  const buckets = new Map<
    string,
    Array<{ slug: string; display: string; latin: string; subtitle: string | null }>
  >();
  for (const p of peptides) {
    const display =
      isBg && p.full_name_bg ? p.full_name_bg : p.name;
    const subtitle =
      isBg && p.full_name_bg && p.name !== p.full_name_bg
        ? p.name
        : isBg
        ? p.full_name_en ?? null
        : p.full_name_bg ?? null;
    const key = bucketKey(display);
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push({
      slug: p.slug,
      display,
      latin: p.name,
      subtitle,
    });
  }

  // Sort each bucket alphabetically
  for (const arr of buckets.values()) {
    arr.sort((a, b) => a.display.localeCompare(b.display, isBg ? "bg" : "en"));
  }

  // Letters that have entries, in display order: numeric first, then either alphabet by locale.
  const letters = Array.from(buckets.keys()).sort((a, b) => {
    if (a === "#") return -1;
    if (b === "#") return 1;
    return a.localeCompare(b, isBg ? "bg" : "en");
  });

  const breadcrumbJsonLd = breadcrumbSchema([
    { name: isBg ? "Начало" : "Home", path: `/${locale}` },
    { name: t("title"), path: `/${locale}/encyclopedia` },
    {
      name: isBg ? "Азбучен указател" : "A–Z Index",
      path: `/${locale}/encyclopedia/azbuka`,
    },
  ]);

  return (
    <main className="flex-1 bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <PageHero
        crumbs={[
          { label: t("title"), href: "/encyclopedia" },
          { label: isBg ? "Азбучен указател" : "A–Z Index" },
        ]}
        title={isBg ? "Азбучен указател на пептиди" : "Peptide A–Z Index"}
        subtitle={
          isBg
            ? `Пълен списък от ${peptides.length}+ пептида в енциклопедията. Скочи към буква или превърти през всички.`
            : `Full list of ${peptides.length}+ peptides in the encyclopedia. Jump to a letter or scroll through all.`
        }
        locale={locale}
      />

      {/* Letter index — sticky top, anchor-link nav */}
      <nav
        aria-label={isBg ? "Преки връзки към буквите" : "Quick letter links"}
        className="sticky top-16 z-20 -mt-2 border-y border-border bg-white/85 backdrop-blur-md"
      >
        <div className="mx-auto max-w-[1280px] px-6 py-3 overflow-x-auto scroll-hidden">
          <ul className="flex items-center gap-1 min-w-max">
            {letters.map((l) => (
              <li key={l}>
                <a
                  href={`#letter-${encodeURIComponent(l)}`}
                  className="inline-flex h-8 min-w-[32px] items-center justify-center rounded-md px-1.5 font-mono text-xs font-semibold text-secondary hover:bg-accent-tint hover:text-accent transition-colors"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Per-letter sections */}
      <section className="mx-auto max-w-[1280px] px-6 py-10 space-y-12">
        {letters.map((letter) => {
          const items = buckets.get(letter)!;
          return (
            <div key={letter} id={`letter-${encodeURIComponent(letter)}`} className="scroll-mt-32">
              <div className="mb-4 flex items-baseline gap-3 border-b border-border pb-3">
                <h2 className="font-display text-3xl font-bold tracking-tight text-navy tabular">
                  {letter}
                </h2>
                <span className="font-mono text-xs text-muted">
                  {items.length}{" "}
                  {isBg
                    ? items.length === 1
                      ? "пептид"
                      : "пептида"
                    : items.length === 1
                    ? "peptide"
                    : "peptides"}
                </span>
              </div>
              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/encyclopedia/${item.slug}`}
                      className="group flex items-start justify-between gap-3 rounded-lg border border-border bg-white px-3 py-2 transition-colors hover:border-accent/50 hover:bg-accent-tint/30"
                    >
                      <div className="min-w-0">
                        <p className="font-mono text-sm font-semibold text-navy">
                          {item.display}
                        </p>
                        {item.subtitle && (
                          <p className="mt-0.5 text-[11px] text-muted truncate">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                      <ArrowUpRight
                        size={14}
                        className="mt-1 shrink-0 text-muted transition-colors group-hover:text-accent"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      {/* Footer link back to encyclopedia main view */}
      <section className="mx-auto max-w-[1280px] px-6 pb-16">
        <Link
          href="/encyclopedia"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
        >
          ← {isBg ? "Към главната енциклопедия" : "Back to main encyclopedia"}
        </Link>
      </section>
    </main>
  );
}
