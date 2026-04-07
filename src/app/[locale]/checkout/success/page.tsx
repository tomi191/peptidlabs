"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { CircleCheck, ArrowLeft, ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/lib/store/cart";

export default function CheckoutSuccessPage() {
  const t = useTranslations("checkout");
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const sessionId = searchParams.get("session_id");
  const cart = useCart();

  // Clear cart on mount — order is confirmed at this point
  useEffect(() => {
    if (cart.items.length > 0) {
      cart.clearCart();
    }
    // Run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isStripePayment = !!sessionId;

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <CircleCheck className="h-12 w-12 text-teal mx-auto" strokeWidth={1.5} />

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-navy">
            {t("success")}
          </h1>
          <p className="text-secondary">
            {t("successMessage")}
          </p>
        </div>

        {orderId && (
          <div className="rounded-lg border border-border bg-surface px-4 py-3">
            <p className="text-sm text-muted">{t("orderId")}</p>
            <p className="text-sm font-mono font-medium text-navy mt-0.5">
              {orderId}
            </p>
          </div>
        )}

        <p className="text-sm text-secondary">
          {isStripePayment ? t("cardPaymentNote") : t("codPaymentNote")}
        </p>

        <div className="flex flex-col gap-3 pt-2">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 bg-navy text-white py-3 px-6 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
          >
            <ShoppingBag className="h-4 w-4" />
            {t("continueShopping")}
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 text-sm text-secondary hover:text-navy transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("backToHome")}
          </Link>
        </div>
      </div>
    </main>
  );
}
