import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getPublishedProducts } from "@/lib/queries";
import { getProductDisplayName } from "@/lib/labels";
import type { Metadata } from "next";
import Link from "next/link";
import { Download, FileText, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { PlaceholderVisual } from "@/components/ui/PlaceholderVisual";
import { buildMetadata } from "@/lib/seo/schema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title =
    locale === "bg"
      ? "Сертификати за анализ (COA) — HPLC тестване"
      : "Certificates of Analysis (COA) — HPLC Testing";
  const description =
    locale === "bg"
      ? "Прозрачността е в основата на нашия бизнес. Сертификат за анализ за всяка партида — HPLC хроматограма, данни за чистота и тестове за ендотоксини."
      : "Transparency is at the core of our business. Certificate of Analysis for every batch — HPLC chromatogram, purity data, and endotoxin test results.";
  return buildMetadata({ title, description, path: `/${locale}/coa-vault`, locale });
}

export default async function CoaVaultPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("coaVault");
  const products = await getPublishedProducts();
  const isBg = locale === "bg";

  const withCoa = products.filter((p) => p.coa_url).length;

  return (
    <main className="flex-1 bg-white">
      <PageHero
        crumbs={[{ label: t("title") }]}
        title={t("title")}
        subtitle={t("intro")}
        locale={locale}
        aside={
          <div className="flex items-center gap-5 font-mono text-[11px] text-muted">
            <div className="text-right">
              <p className="uppercase tracking-widest">{products.length}</p>
              <p className="mt-1 text-[9px]">
                {isBg ? "продукта" : "products"}
              </p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="text-right">
              <p className="uppercase tracking-widest">{withCoa}</p>
              <p className="mt-1 text-[9px]">
                {isBg ? "с COA онлайн" : "COA online"}
              </p>
            </div>
          </div>
        }
      />

      <div className="mx-auto max-w-[1280px] px-6 pb-16">
        <section className="mb-10 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
          <div>
            <h2 className="font-display text-2xl font-bold text-navy mb-4 tracking-[-0.02em]">
              {isBg
                ? "Сертификат за анализ за всяка партида"
                : "Certificate of Analysis for every batch"}
            </h2>
            <p className="text-secondary leading-relaxed">
              {isBg
                ? "COA (Certificate of Analysis) е документ от независима лаборатория, който потвърждава чистотата, идентичността и липсата на замърсители в конкретна партида. Включва HPLC хроматограма, масспектрометричен анализ, съдържание на ендотоксини и тестове за тежки метали."
                : "A COA (Certificate of Analysis) is an independent laboratory document confirming the purity, identity and absence of contaminants in a specific batch. It includes the HPLC chromatogram, mass spectrometry analysis, endotoxin content and heavy metal tests."}
            </p>
          </div>
          <PlaceholderVisual
            variant="certificate"
            label={isBg ? "Примерен COA" : "Sample COA"}
            className="aspect-[4/3]"
          />
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-navy mb-6 tracking-[-0.02em]">
            {isBg ? "Сертификати по продукт" : "Certificates by product"}
          </h2>

          {products.length === 0 ? (
            <p className="text-sm text-muted">{t("noProducts")}</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => {
                const displayName = getProductDisplayName(product, locale);
                const useCase =
                  locale === "bg"
                    ? product.use_case_tag_bg
                    : product.use_case_tag_en;
                const hasCoa = !!product.coa_url;

                return (
                  <div
                    key={product.id}
                    className="border border-border rounded-xl p-5 flex flex-col bg-white hover:border-navy/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/${locale}/products/${product.slug}`}
                          className="font-semibold text-navy hover:text-teal-600 transition-colors text-sm block"
                        >
                          {displayName}
                          {product.vial_size_mg && (
                            <span className="text-muted font-mono ml-1">
                              {product.vial_size_mg}mg
                            </span>
                          )}
                        </Link>
                        {useCase && (
                          <p className="text-xs text-muted mt-1">{useCase}</p>
                        )}
                      </div>
                      <ShieldCheck
                        size={18}
                        className={hasCoa ? "text-teal-600" : "text-muted"}
                      />
                    </div>

                    <div className="mt-3 flex items-center gap-2 font-mono text-xs">
                      <span className="text-muted">{t("purity")}:</span>
                      <span className="font-semibold text-navy tabular">
                        над {product.purity_percent}%
                      </span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-border mt-4">
                      {hasCoa ? (
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                            <FileText size={12} strokeWidth={1.5} />
                            {t("available")}
                          </span>
                          <a
                            href={product.coa_url!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:text-teal-700 transition-colors"
                          >
                            <Download size={12} strokeWidth={1.5} />
                            {t("download")}
                          </a>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                            <FileText size={12} strokeWidth={1.5} />
                            {t("onRequest")}
                          </span>
                          <Link
                            href={`/${locale}/contact`}
                            className="text-xs font-medium text-teal-600 hover:text-teal-700 transition-colors"
                          >
                            {t("contactForCoa")}
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
