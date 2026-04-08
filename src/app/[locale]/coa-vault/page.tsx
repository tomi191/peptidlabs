import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getPublishedProducts } from "@/lib/queries";
import { getProductDisplayName } from "@/lib/labels";
import type { Metadata } from "next";
import Link from "next/link";
import { Download, FileText, ShieldCheck } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title =
    locale === "bg"
      ? "Сертификати за анализ (COA) — HPLC тестване | PeptideLab"
      : "Certificates of Analysis (COA) — HPLC Testing | PeptideLab";
  const description =
    locale === "bg"
      ? "Прозрачността е в основата на нашия бизнес. Сертификат за анализ за всяка партида — HPLC хроматограма, данни за чистота и тестове за ендотоксини."
      : "Transparency is at the core of our business. Certificate of Analysis for every batch — HPLC chromatogram, purity data, and endotoxin test results.";
  return { title, description };
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

  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-16">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck size={28} strokeWidth={1.5} className="text-teal-600" />
          <h1 className="text-3xl font-bold text-navy">{t("title")}</h1>
        </div>
        <p className="mt-3 max-w-3xl text-secondary leading-relaxed">
          {t("intro")}
        </p>

        {products.length === 0 ? (
          <p className="mt-10 text-sm text-muted">{t("noProducts")}</p>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                  className="border border-border rounded-lg p-5 flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/${locale}/products/${product.slug}`}
                        className="font-medium text-navy hover:text-teal-600 transition-colors text-sm"
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
                  </div>

                  {/* Purity */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-secondary">
                      {t("purity")}:
                    </span>
                    <span className="font-mono text-sm text-navy font-medium">
                      {product.purity_percent}%
                    </span>
                  </div>

                  {/* COA status */}
                  <div className="mt-auto pt-4">
                    {hasCoa ? (
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                          <FileText size={14} strokeWidth={1.5} />
                          {t("available")}
                        </span>
                        <a
                          href={product.coa_url!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:text-teal-700 transition-colors"
                        >
                          <Download size={14} strokeWidth={1.5} />
                          {t("download")}
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                          <FileText size={14} strokeWidth={1.5} />
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
      </div>
    </main>
  );
}
