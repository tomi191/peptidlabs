import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { NewsletterSignup } from "./NewsletterSignup";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return { title: t("title") };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");

  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-16">
        <h1 className="text-3xl font-bold text-navy">{t("title")}</h1>
        <p className="mt-3 text-secondary">{t("subtitle")}</p>

        <div className="mt-10 max-w-md">
          <p className="text-sm text-muted mb-6">{t("comingSoon")}</p>

          <div className="border border-border rounded-lg p-6">
            <p className="text-sm font-medium text-navy mb-4">
              {t("subscribePrompt")}
            </p>
            <NewsletterSignup />
          </div>
        </div>
      </div>
    </main>
  );
}
