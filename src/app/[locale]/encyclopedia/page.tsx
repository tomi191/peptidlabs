import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getPeptides } from "@/lib/queries";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "encyclopedia" });
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function EncyclopediaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("encyclopedia");
  const peptides = await getPeptides();

  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-16">
        <h1 className="text-3xl font-bold text-navy">{t("title")}</h1>
        <p className="mt-3 text-secondary max-w-xl">{t("subtitle")}</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {peptides.map((peptide) => {
            const fullName =
              locale === "bg"
                ? peptide.full_name_bg || peptide.full_name_en
                : peptide.full_name_en || peptide.full_name_bg;

            return (
              <Link
                key={peptide.id}
                href={`/${locale}/encyclopedia/${peptide.slug}`}
                className="border border-border rounded-lg p-5 hover:border-teal-600 transition-colors group"
              >
                <p className="font-mono text-sm font-medium text-navy group-hover:text-teal-600 transition-colors">
                  {peptide.name}
                </p>
                {fullName && (
                  <p className="text-xs text-muted mt-1 line-clamp-1">
                    {fullName}
                  </p>
                )}
                {peptide.formula && (
                  <p className="font-mono text-xs text-muted mt-2">
                    {peptide.formula}
                  </p>
                )}
              </Link>
            );
          })}
        </div>

        {peptides.length === 0 && (
          <p className="mt-10 text-sm text-muted">{t("noPeptides")}</p>
        )}
      </div>
    </main>
  );
}
