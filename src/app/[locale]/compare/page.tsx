import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { createStaticSupabase } from "@/lib/supabase/static";
import type { Product } from "@/lib/types";
import { getProductDisplayName, getFormLabel } from "@/lib/labels";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import { COABadge } from "@/components/ui/COABadge";
import { VialPlaceholder } from "@/components/ui/VialPlaceholder";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ slugs?: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isBg = locale === "bg";
  return {
    title: isBg ? "Сравни пептиди — PeptidLabs" : "Compare peptides — PeptidLabs",
    description: isBg
      ? "Сравни до 4 изследователски пептида един срещу друг — цена, дозировка, чистота, механизъм, странични ефекти."
      : "Compare up to 4 research peptides side by side — price, dosage, purity, mechanism, side effects.",
    robots: { index: false }, // dynamic compare page
  };
}

export default async function ComparePage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const { slugs: slugsParam } = await searchParams;
  setRequestLocale(locale);
  const isBg = locale === "bg";

  const slugs = (slugsParam ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  let products: Product[] = [];
  if (slugs.length > 0) {
    const supabase = createStaticSupabase();
    const { data } = await supabase
      .from("products")
      .select("*")
      .in("slug", slugs)
      .eq("status", "published");
    // Preserve URL order
    const map = new Map<string, Product>((data ?? []).map((p) => [p.slug, p as Product]));
    products = slugs.map((s) => map.get(s)).filter((p): p is Product => Boolean(p));
  }

  const empty = products.length === 0;

  return (
    <div className="mx-auto max-w-[1280px] px-4 md:px-6 py-12">
      <div className="mb-8">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-navy transition-colors"
        >
          <ArrowLeft size={14} />
          {isBg ? "Към магазина" : "Back to shop"}
        </Link>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
          {isBg ? "[Сравни]" : "[Compare]"}
        </p>
        <h1 className="mt-2 font-display text-3xl md:text-4xl font-bold text-navy tracking-[-0.03em]">
          {isBg ? "Сравни пептиди" : "Compare peptides"}
        </h1>
        <p className="mt-2 text-sm text-secondary max-w-prose">
          {isBg
            ? "Технически параметри, странични ефекти и цена един срещу друг."
            : "Technical parameters, side effects, and price side by side."}
        </p>
      </div>

      {empty ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
          <p className="text-base font-semibold text-navy">
            {isBg ? "Не са избрани продукти" : "No products selected"}
          </p>
          <p className="mt-2 text-sm text-secondary">
            {isBg
              ? "Натисни иконката за сравнение на 2-4 продукта в магазина."
              : "Tap the compare icon on 2-4 products in the shop."}
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-navy/90 transition-colors"
          >
            {isBg ? "Към магазина" : "Browse shop"}
          </Link>
        </div>
      ) : (
        <CompareTable products={products} locale={locale} />
      )}
    </div>
  );
}

/* ─── Compare table ─── */

function CompareTable({ products, locale }: { products: Product[]; locale: string }) {
  const isBg = locale === "bg";
  const cols = products.length;
  const gridStyle = {
    gridTemplateColumns: `minmax(120px, 200px) repeat(${cols}, minmax(180px, 1fr))`,
  };

  // Determine best price (lowest)
  const minPrice = Math.min(...products.map((p) => p.price_eur));

  // Spec row helper
  const Row = ({
    label,
    cells,
    highlight,
  }: {
    label: string;
    cells: React.ReactNode[];
    highlight?: boolean;
  }) => (
    <div
      className={`grid items-start gap-4 border-b border-border py-4 px-3 md:px-4 ${highlight ? "bg-teal-50/40" : ""}`}
      style={gridStyle}
    >
      <div className="font-mono text-[10px] uppercase tracking-wider text-muted font-medium">
        {label}
      </div>
      {cells.map((cell, i) => (
        <div key={i} className="text-sm text-secondary">{cell}</div>
      ))}
    </div>
  );

  // Helpers to extract scientific_data fields
  const getSci = (p: Product, key: string): string | null => {
    const sci = p.scientific_data as Record<string, unknown> | null;
    const v = sci?.[key];
    return typeof v === "string" ? v : null;
  };

  return (
    <div className="overflow-x-auto -mx-4 md:mx-0">
      <div className="min-w-[720px] rounded-3xl border border-border bg-white">
        {/* Header row — product cards */}
        <div className="grid items-end gap-4 border-b border-border p-3 md:p-4" style={gridStyle}>
          <div></div>
          {products.map((p) => {
            const displayName = getProductDisplayName(p, locale);
            return (
              <div key={p.id} className="flex flex-col gap-3">
                <Link
                  href={`/products/${p.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-surface">
                    {p.images && p.images.length > 0 ? (
                      <Image
                        src={p.images[0]}
                        alt={displayName}
                        fill
                        sizes="200px"
                        className="object-contain p-3 group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <VialPlaceholder name={p.name} size="sm" />
                    )}
                    {p.coa_url && (
                      <COABadge variant="overlay" className="absolute right-2 top-2" />
                    )}
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-navy line-clamp-2 group-hover:text-accent">
                    {displayName}
                  </h3>
                </Link>
                <p
                  className={`text-lg font-bold tabular ${p.price_eur === minPrice && cols > 1 ? "text-emerald-600" : "text-navy"}`}
                >
                  €{p.price_eur.toFixed(2)}
                  {p.price_eur === minPrice && cols > 1 && (
                    <span className="ml-1.5 text-[10px] font-medium uppercase tracking-wider text-emerald-700">
                      {isBg ? "Най-евтин" : "Lowest"}
                    </span>
                  )}
                </p>
                <AddToCartButton product={p} />
              </div>
            );
          })}
        </div>

        {/* Spec rows */}
        <Row
          label={isBg ? "Дозировка" : "Vial size"}
          cells={products.map((p) => (
            <span className="font-semibold text-navy">{p.vial_size_mg ? `${p.vial_size_mg} mg` : "—"}</span>
          ))}
        />
        <Row
          label={isBg ? "Чистота" : "Purity"}
          cells={products.map((p) => (
            <span className="font-semibold text-navy">{p.purity_percent}% HPLC</span>
          ))}
        />
        <Row
          label={isBg ? "Форма" : "Form"}
          cells={products.map((p) => (
            <span>{getFormLabel(p.form, locale)}</span>
          ))}
        />
        <Row
          label={isBg ? "Цена / mg" : "Price / mg"}
          cells={products.map((p) =>
            p.vial_size_mg
              ? <span className="font-mono">€{(p.price_eur / Number(p.vial_size_mg)).toFixed(2)}/mg</span>
              : "—",
          )}
          highlight
        />
        <Row
          label="SKU"
          cells={products.map((p) => <span className="font-mono text-xs">{p.sku}</span>)}
        />
        <Row
          label={isBg ? "Категория" : "Category"}
          cells={products.map((p) =>
            (locale === "bg" ? p.use_case_tag_bg : p.use_case_tag_en) ?? "—",
          )}
        />
        <Row
          label={isBg ? "COA сертификат" : "COA"}
          cells={products.map((p) =>
            p.coa_url ? (
              <span className="inline-flex items-center gap-1 text-emerald-700">
                <CheckCircle2 size={14} /> {isBg ? "Включен" : "Included"}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-muted">
                <XCircle size={14} /> {isBg ? "При заявка" : "On request"}
              </span>
            ),
          )}
        />
        <Row
          label={isBg ? "Наличност" : "Stock"}
          cells={products.map((p) =>
            p.stock > 0 ? (
              <span className="text-emerald-700 font-medium">{isBg ? "В наличност" : "In stock"}</span>
            ) : (
              <span className="text-amber-600 font-medium">{isBg ? "Изчерпан" : "Sold out"}</span>
            ),
          )}
        />

        {/* Long-form rows — only if BG (where we have content) */}
        {locale === "bg" && (
          <>
            <Row
              label="TLDR"
              cells={products.map((p) => (
                <span className="text-xs leading-relaxed">
                  {getSci(p, "plain_tldr_bg") ?? "—"}
                </span>
              ))}
            />
            <Row
              label={isBg ? "Странични ефекти" : "Side effects"}
              cells={products.map((p) => (
                <span className="text-xs leading-relaxed">
                  {getSci(p, "side_effects_bg")?.slice(0, 200) ?? "—"}
                  {(getSci(p, "side_effects_bg")?.length ?? 0) > 200 ? "…" : ""}
                </span>
              ))}
            />
          </>
        )}
      </div>
    </div>
  );
}
