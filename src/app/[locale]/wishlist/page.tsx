import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { createStaticSupabase } from "@/lib/supabase/static";
import type { Product } from "@/lib/types";
import { WishlistClient } from "./WishlistClient";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isBg = locale === "bg";
  return {
    title: isBg ? "Любими" : "Wishlist",
    description: isBg
      ? "Запазените от теб изследователски пептиди — за бърз достъп при следваща поръчка."
      : "Your saved research peptides — for quick access on your next order.",
    robots: { index: false, follow: true },
  };
}

export default async function WishlistPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "common" }).catch(() => null);
  const isBg = locale === "bg";

  const supabase = createStaticSupabase();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("status", "published")
    .order("name_bg");

  const allProducts = (data ?? []) as Product[];

  return (
    <div className="mx-auto max-w-[1280px] px-4 md:px-6 py-12">
      <div className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
          {isBg ? "[Запазени]" : "[Saved]"}
        </p>
        <h1 className="mt-2 font-display text-3xl md:text-4xl font-bold text-navy tracking-[-0.03em]">
          {isBg ? "Любими" : "Wishlist"}
        </h1>
        <p className="mt-2 text-sm text-secondary max-w-prose">
          {isBg
            ? "Запазените от теб продукти за по-късно — синхронизирани в това устройство и достъпни без регистрация."
            : "Your saved products for later — synced on this device and available without an account."}
        </p>
      </div>

      <WishlistClient allProducts={allProducts} />
    </div>
  );
}
