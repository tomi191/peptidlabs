"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Lock } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import { PRE_LAUNCH_MODE } from "@/lib/config";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const isBg = locale === "bg";
  const router = useRouter();
  const { items } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pre-launch: redirect checkout to waitlist
  useEffect(() => {
    if (PRE_LAUNCH_MODE && mounted) {
      router.push(`/${locale}/waitlist`);
    }
  }, [mounted, router, locale]);

  useEffect(() => {
    if (!PRE_LAUNCH_MODE && mounted && items.length === 0) {
      router.push("/shop");
    }
  }, [mounted, items.length, router]);

  // Avoid hydration mismatch for persisted cart
  if (!mounted) {
    return (
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-[1280px] px-6 py-10">
          <div className="h-8 w-48 bg-surface rounded animate-pulse" />
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto max-w-[1280px] px-6 pt-8 pb-16">
        {/* Breadcrumb */}
        <nav className="text-xs text-muted mb-6">
          <Link href="/" className="hover:text-teal-600">
            {isBg ? "Начало" : "Home"}
          </Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-teal-600">
            {isBg ? "Магазин" : "Shop"}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-navy">{t("title")}</span>
        </nav>

        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-navy tracking-[-0.03em]">
              {t("title")}
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50/50 px-4 py-2 font-mono text-[11px]">
            <Lock size={12} className="text-teal-700" />
            <span className="text-teal-700 uppercase tracking-widest">
              {isBg ? "Защитено" : "Secure"}
            </span>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-3 mb-10 text-sm">
          <span className="flex items-center gap-2 text-navy font-semibold">
            <span className="w-7 h-7 rounded-full bg-navy text-white flex items-center justify-center text-xs font-mono">
              1
            </span>
            {t("stepInfo")}
          </span>
          <div className="w-10 h-px bg-border" />
          <span className="flex items-center gap-2 text-muted">
            <span className="w-7 h-7 rounded-full border border-border text-muted flex items-center justify-center text-xs font-mono">
              2
            </span>
            {t("stepPayment")}
          </span>
          <div className="w-10 h-px bg-border" />
          <span className="flex items-center gap-2 text-muted">
            <span className="w-7 h-7 rounded-full border border-border text-muted flex items-center justify-center text-xs font-mono">
              3
            </span>
            {t("stepConfirmation")}
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left column: form */}
          <div className="lg:col-span-7">
            <CheckoutForm />
          </div>

          {/* Right column: order summary */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <OrderSummary />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
