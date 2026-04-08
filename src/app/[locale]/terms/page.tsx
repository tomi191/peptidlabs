import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-navy mb-4">{t("termsTitle")}</h1>
        <p className="text-sm text-muted">{t("comingSoon")}</p>
      </div>
    </main>
  );
}
