"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ShoppingBag, Truck } from "lucide-react";
import NumberFlow from "@number-flow/react";
import { useCart } from "@/lib/store/cart";
import { SHIPPING } from "@/lib/constants";

export default function OrderSummary() {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const { items, totalPrice } = useCart();

  const subtotal = totalPrice("EUR");
  const shippingConfig = SHIPPING.EUR;
  const threshold = shippingConfig.freeAbove;
  const shippingBase = shippingConfig.cost;
  const isFreeShipping = subtotal >= threshold;
  const shippingCost = isFreeShipping ? 0 : shippingBase;
  const total = subtotal + shippingCost;
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const [promoOpen, setPromoOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const handleApplyPromo = async () => {
    // TODO: Validate against /api/coupons/validate when coupons are added
    setPromoError(t("invalidCode"));
  };

  return (
    <div className="bg-surface rounded-xl p-6 lg:sticky lg:top-8">
      <h2 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
        <ShoppingBag className="h-5 w-5" />
        {t("orderSummary")}
      </h2>

      <div className="space-y-3 mb-4">
        {items.map((item) => {
          const name =
            locale === "bg" && item.product.name_bg
              ? item.product.name_bg
              : item.product.name;
          const price = item.product.price_eur;

          return (
            <div key={item.product.id} className="flex justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-navy truncate">{name}</p>
                {item.product.vial_size_mg && (
                  <p className="text-xs text-muted font-mono">
                    {item.product.vial_size_mg}mg
                  </p>
                )}
              </div>
              <p className="text-sm text-navy whitespace-nowrap tabular">
                {item.quantity} x €{price.toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Promo code section */}
      <div className="mt-3 border-t border-border pt-3">
        {!promoApplied ? (
          <>
            <button
              onClick={() => setPromoOpen(!promoOpen)}
              className="text-sm text-accent hover:underline"
            >
              {promoOpen ? t("removeCode") : t("promoCode")}
            </button>
            {promoOpen && (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder={t("promoCode")}
                  className="flex-1 rounded-md border border-border px-3 py-2 font-mono text-sm uppercase text-navy placeholder:text-muted focus:border-navy focus:outline-none"
                />
                <button
                  onClick={handleApplyPromo}
                  className="rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white"
                >
                  {t("apply")}
                </button>
              </div>
            )}
            {promoError && (
              <p className="mt-1 text-xs text-red-500">{promoError}</p>
            )}
          </>
        ) : (
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-accent">
              Code: {promoCode}
            </span>
            <button
              onClick={() => {
                setPromoApplied(false);
                setPromoCode("");
              }}
              className="text-xs text-muted hover:text-red-500"
            >
              {t("removeCode")}
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-border pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-secondary">{t("subtotal")}</span>
          <span className="text-navy tabular">
            <NumberFlow
              value={subtotal}
              format={{ style: "currency", currency: "EUR" }}
            />
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-secondary flex items-center gap-1.5">
            <Truck className="h-4 w-4" />
            {t("shippingCost")}
          </span>
          {isFreeShipping ? (
            <span className="text-accent font-medium">{t("freeShipping")}</span>
          ) : (
            <span className="text-navy tabular">
              €{shippingCost.toFixed(2)}
            </span>
          )}
        </div>

        <div className="border-t border-border pt-3 flex justify-between">
          <span className="font-bold text-lg text-navy">{t("total")}</span>
          <span className="font-bold text-lg text-navy tabular">
            <NumberFlow
              value={total}
              format={{ style: "currency", currency: "EUR" }}
            />
          </span>
        </div>
      </div>

      <p className="text-xs text-muted mt-3 text-center">
        {itemCount} {t("itemsInCart")}
      </p>
    </div>
  );
}
