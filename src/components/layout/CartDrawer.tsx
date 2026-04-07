"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/store/cart";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
  locale: string;
};

export default function CartDrawer({ open, onClose, locale }: CartDrawerProps) {
  const t = useTranslations("cart");
  const items = useCart((s) => s.items);
  const removeItem = useCart((s) => s.removeItem);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const totalPrice = useCart((s) => s.totalPrice);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, handleKeyDown]);

  if (!mounted) return null;

  const currency = locale === "bg" ? "BGN" : "EUR";
  const subtotal = totalPrice(currency);

  function formatPrice(amount: number): string {
    if (currency === "BGN") {
      return `${amount.toFixed(2)} лв`;
    }
    return `€${amount.toFixed(2)}`;
  }

  function getItemPrice(item: (typeof items)[number]): number {
    return currency === "EUR"
      ? item.product.price_eur
      : item.product.price_bgn;
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/30 transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className={`fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={t("title")}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-navy font-semibold text-lg">{t("title")}</h2>
          <button
            onClick={onClose}
            className="text-secondary hover:text-navy transition-colors"
            aria-label="Close"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center flex-1 gap-4">
            <ShoppingBag size={48} strokeWidth={1} className="text-muted" />
            <p className="text-secondary text-sm">{t("empty")}</p>
            <Link
              href="/shop"
              onClick={onClose}
              className="text-accent text-sm font-medium hover:underline"
            >
              {t("shopNow")}
            </Link>
          </div>
        ) : (
          <>
            {/* Item list */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 py-4 border-b border-border last:border-0"
                >
                  {/* Product image placeholder */}
                  <div className="w-16 h-16 bg-surface rounded-md flex items-center justify-center shrink-0">
                    {item.product.images[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <ShoppingBag
                        size={20}
                        strokeWidth={1}
                        className="text-muted"
                      />
                    )}
                  </div>

                  {/* Product details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy truncate">
                      {locale === "bg" && item.product.name_bg
                        ? item.product.name_bg
                        : item.product.name}
                    </p>
                    <p className="font-mono text-xs text-muted">
                      {item.product.vial_size_mg
                        ? `${item.product.vial_size_mg}mg`
                        : ""}
                      {item.product.vial_size_mg && item.product.form
                        ? " \u00b7 "
                        : ""}
                      {item.product.form ?? ""}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity - 1
                            )
                          }
                          className="w-7 h-7 rounded border border-border flex items-center justify-center text-secondary hover:text-navy transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} strokeWidth={1.5} />
                        </button>
                        <span className="text-sm text-navy w-5 text-center tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity + 1
                            )
                          }
                          className="w-7 h-7 rounded border border-border flex items-center justify-center text-secondary hover:text-navy transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} strokeWidth={1.5} />
                        </button>
                      </div>

                      {/* Price + remove */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-navy">
                          {formatPrice(getItemPrice(item) * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-muted hover:text-red-500 transition-colors"
                          aria-label={t("remove")}
                        >
                          <Trash2 size={14} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-border px-6 py-4">
              <div className="flex justify-between text-sm text-secondary">
                <span>{t("subtotal")}</span>
                <span className="font-semibold text-navy">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="text-xs text-muted mt-1">
                {t("freeShippingNote")}
              </p>
              <button className="w-full bg-navy text-white py-3 rounded-lg font-semibold text-sm mt-4 hover:bg-navy/90 transition-colors">
                {t("checkout")}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
