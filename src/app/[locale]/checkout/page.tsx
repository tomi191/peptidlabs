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
        <h1 className="text-2xl font-bold text-navy mb-8">{t("title")}</h1>

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
