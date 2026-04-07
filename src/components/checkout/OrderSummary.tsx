"use client";

import { useTranslations, useLocale } from "next-intl";
import { ShoppingBag, Truck } from "lucide-react";
import { useCart } from "@/lib/store/cart";

const FREE_SHIPPING_THRESHOLD_BGN = 99;
const FREE_SHIPPING_THRESHOLD_EUR = 49;
const SHIPPING_COST_BGN = 5.99;
const SHIPPING_COST_EUR = 4.99;

export default function OrderSummary() {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const { items, totalPrice } = useCart();

  const currency = locale === "bg" ? "BGN" : "EUR";
  const subtotal = totalPrice(currency);
  const threshold =
    currency === "BGN" ? FREE_SHIPPING_THRESHOLD_BGN : FREE_SHIPPING_THRESHOLD_EUR;
  const shippingBase =
    currency === "BGN" ? SHIPPING_COST_BGN : SHIPPING_COST_EUR;
  const isFreeShipping = subtotal >= threshold;
  const shippingCost = isFreeShipping ? 0 : shippingBase;
  const total = subtotal + shippingCost;
  const currencySymbol = currency === "BGN" ? "лв" : "EUR";
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

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
          const price =
            currency === "BGN"
              ? item.product.price_bgn
              : item.product.price_eur;

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
              <p className="text-sm text-navy whitespace-nowrap">
                {item.quantity} x {price.toFixed(2)} {currencySymbol}
              </p>
            </div>
          );
        })}
      </div>

      <div className="border-t border-border pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-secondary">{t("subtotal")}</span>
          <span className="text-navy">
            {subtotal.toFixed(2)} {currencySymbol}
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
            <span className="text-navy">
              {shippingCost.toFixed(2)} {currencySymbol}
            </span>
          )}
        </div>

        <div className="border-t border-border pt-3 flex justify-between">
          <span className="font-bold text-lg text-navy">{t("total")}</span>
          <span className="font-bold text-lg text-navy">
            {total.toFixed(2)} {currencySymbol}
          </span>
        </div>
      </div>

      <p className="text-xs text-muted mt-3 text-center">
        {itemCount} {t("itemsInCart")}
      </p>
    </div>
  );
}
