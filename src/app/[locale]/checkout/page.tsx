"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/store/cart";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const router = useRouter();
  const { items } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push("/shop");
    }
  }, [mounted, items.length, router]);

  // Avoid hydration mismatch for persisted cart
  if (!mounted) {
    return (
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
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
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-bold text-navy mb-6">{t("title")}</h1>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-3 mb-8 text-sm">
          <span className="flex items-center gap-1.5 text-navy font-semibold">
            <span className="w-6 h-6 rounded-full bg-navy text-white flex items-center justify-center text-xs">1</span>
            {t("stepInfo")}
          </span>
          <div className="w-8 h-px bg-border" />
          <span className="flex items-center gap-1.5 text-muted">
            <span className="w-6 h-6 rounded-full border border-border text-muted flex items-center justify-center text-xs">2</span>
            {t("stepPayment")}
          </span>
          <div className="w-8 h-px bg-border" />
          <span className="flex items-center gap-1.5 text-muted">
            <span className="w-6 h-6 rounded-full border border-border text-muted flex items-center justify-center text-xs">3</span>
            {t("stepConfirmation")}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column: form */}
          <div className="w-full lg:w-3/5">
            <CheckoutForm />
          </div>

          {/* Right column: order summary */}
          <div className="w-full lg:w-2/5">
            <OrderSummary />
          </div>
        </div>
      </div>
    </main>
  );
}
