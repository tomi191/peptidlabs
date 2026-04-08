import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import {
  getPeptides,
  getPeptideBySlug,
  getProductsForPeptide,
} from "@/lib/queries";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateStaticParams() {
  const peptides = await getPeptides();
  return routing.locales.flatMap((locale) =>
    peptides.map((p) => ({ locale, slug: p.slug }))
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
  return {
    title: `${peptide.name}${fullName ? ` — ${fullName}` : ""} | ${t("title")}`,
    description: fullName || peptide.name,
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

  const peptide = await getPeptideBySlug(slug);
  if (!peptide) notFound();

  const products = await getProductsForPeptide(slug);
  const allPeptides = await getPeptides();
  const related = allPeptides
    .filter((p) => p.id !== peptide.id)
    .slice(0, 6);

  const fullName =
    locale === "bg"
      ? peptide.full_name_bg || peptide.full_name_en
      : peptide.full_name_en || peptide.full_name_bg;

  const mechanism =
    locale === "bg"
      ? peptide.mechanism_bg || peptide.mechanism_en
      : peptide.mechanism_en || peptide.mechanism_bg;

  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-16">
        {/* Breadcrumb */}
        <nav className="text-xs text-muted mb-8">
          <Link href={`/${locale}/encyclopedia`} className="hover:text-teal-600">
            {t("title")}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-navy">{peptide.name}</span>
        </nav>

        {/* Header */}
        <h1 className="font-mono text-2xl font-bold text-navy">
          {peptide.name}
        </h1>
        {fullName && (
          <p className="mt-1 text-secondary">{fullName}</p>
        )}

        {/* Data */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {/* Formula */}
            {peptide.formula && (
              <section>
                <h2 className="text-sm font-semibold text-navy mb-2">
                  {t("formula")}
                </h2>
                <p className="font-mono text-sm text-secondary">
                  {peptide.formula}
                </p>
              </section>
            )}

            {/* Mechanism */}
            {mechanism && (
              <section>
                <h2 className="text-sm font-semibold text-navy mb-2">
                  {t("mechanism")}
                </h2>
                <p className="text-sm text-secondary leading-relaxed">
                  {mechanism}
                </p>
              </section>
            )}

            {/* PubMed */}
            {peptide.research_links && peptide.research_links.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-navy mb-2">
                  {t("pubmedLinks")}
                </h2>
                <ul className="space-y-1">
                  {peptide.research_links.map((url, i) => (
                    <li key={i}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-teal-600 hover:underline break-all"
                      >
                        {url}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Products sidebar */}
          {products.length > 0 && (
            <aside>
              <h2 className="text-sm font-semibold text-navy mb-4">
                {t("productsWithPeptide")}
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
                      {locale === "bg"
                        ? `${product.price_bgn.toFixed(2)} лв`
                        : `€${product.price_eur.toFixed(2)}`}
                    </p>
                  </Link>
                ))}
              </div>
            </aside>
          )}
        </div>

        {/* Related peptides */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-border pt-10">
            <h2 className="text-lg font-semibold text-navy mb-6">
              {t("relatedPeptides")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => {
                const rFullName =
                  locale === "bg"
                    ? p.full_name_bg || p.full_name_en
                    : p.full_name_en || p.full_name_bg;
                return (
                  <Link
                    key={p.id}
                    href={`/${locale}/encyclopedia/${p.slug}`}
                    className="border border-border rounded-lg p-4 hover:border-teal-600 transition-colors"
                  >
                    <p className="font-mono text-sm font-medium text-navy">
                      {p.name}
                    </p>
                    {rFullName && (
                      <p className="text-xs text-muted mt-1 line-clamp-1">
                        {rFullName}
                      </p>
                    )}
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
