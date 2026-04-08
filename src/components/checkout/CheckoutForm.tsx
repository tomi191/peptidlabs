"use client";

import { useState, type FormEvent } from "react";
import { useTranslations, useLocale } from "next-intl";
import { CreditCard, Banknote, Loader2 } from "lucide-react";
import { useRouter, Link } from "@/i18n/navigation";
import { useCart } from "@/lib/store/cart";
import { SHIPPING } from "@/lib/constants";

type PaymentMethod = "stripe" | "cod";

type FormData = {
  email: string;
  phone: string;
  fullName: string;
  address: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  country: string;
};

type FormErrors = Partial<Record<keyof FormData | "researchConfirm" | "termsAccepted", string>>;

const EU_COUNTRIES = [
  "Bulgaria",
  "Austria",
  "Belgium",
  "Croatia",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Hungary",
  "Ireland",
  "Italy",
  "Latvia",
  "Lithuania",
  "Luxembourg",
  "Malta",
  "Netherlands",
  "Poland",
  "Portugal",
  "Romania",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Sweden",
];

const INPUT_CLASS =
  "w-full rounded-lg border border-border px-4 py-3 text-sm text-navy placeholder:text-muted focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy";
const INPUT_ERROR_CLASS =
  "w-full rounded-lg border border-red-400 px-4 py-3 text-sm text-navy placeholder:text-muted focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400";
const LABEL_CLASS = "block text-sm font-medium text-navy mb-1.5";

export default function CheckoutForm() {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const router = useRouter();
  const cart = useCart();

  const currency = locale === "bg" ? "BGN" : "EUR";
  const subtotal = cart.totalPrice(currency as "BGN" | "EUR");
  const shippingConfig = SHIPPING[currency as keyof typeof SHIPPING];
  const threshold = shippingConfig.freeAbove;
  const shippingBase = shippingConfig.cost;
  const shippingCost = subtotal >= threshold ? 0 : shippingBase;
  const total = subtotal + shippingCost;

  const [formData, setFormData] = useState<FormData>({
    email: "",
    phone: "",
    fullName: "",
    address: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    country: "Bulgaria",
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");
  const [researchConfirmed, setResearchConfirmed] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  function handleChange(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-switch from COD if country is not Bulgaria
    if (field === "country" && value !== "Bulgaria" && paymentMethod === "cod") {
      setPaymentMethod("stripe");
    }

    // Clear error for this field when user types
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function validate(): FormErrors {
    const errs: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      errs.email = t("required");
    } else if (!emailRegex.test(formData.email)) {
      errs.email = t("invalidEmail");
    }

    if (!formData.phone.trim()) {
      errs.phone = t("required");
    } else if (formData.phone.trim().length < 8) {
      errs.phone = t("invalidPhone");
    }

    if (!formData.fullName.trim()) errs.fullName = t("required");
    if (!formData.address.trim()) errs.address = t("required");
    if (!formData.city.trim()) errs.city = t("required");
    if (!formData.postalCode.trim()) errs.postalCode = t("required");
    if (!formData.country) errs.country = t("required");

    if (!researchConfirmed) {
      errs.researchConfirm = t("required");
    }

    if (!termsAccepted) {
      errs.termsAccepted = t("required");
    }

    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setApiError(null);
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      if (paymentMethod === "cod") {
        const res = await fetch("/api/orders/cod", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            phone: formData.phone,
            shippingAddress: {
              name: formData.fullName,
              address: formData.address,
              addressLine2: formData.addressLine2,
              city: formData.city,
              postalCode: formData.postalCode,
              country: formData.country,
            },
            items: cart.items.map((i) => ({
              productId: i.product.id,
              productName: i.product.name,
              quantity: i.quantity,
              unitPrice:
                currency === "EUR"
                  ? i.product.price_eur
                  : i.product.price_bgn,
            })),
            subtotal,
            shippingCost,
            total,
            currency,
            locale,
            researchConfirmed: true,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setApiError(data.error || "Failed to place order");
          return;
        }

        cart.clearCart();
        router.push(`/checkout/success?order=${data.orderId}`);
      } else {
        // Stripe Checkout redirect flow
        const res = await fetch("/api/checkout/stripe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            phone: formData.phone,
            shippingAddress: {
              name: formData.fullName,
              address: formData.address,
              addressLine2: formData.addressLine2,
              city: formData.city,
              postalCode: formData.postalCode,
              country: formData.country,
            },
            items: cart.items.map((i) => ({
              productId: i.product.id,
              productName: i.product.name,
              quantity: i.quantity,
              unitPrice:
                currency === "EUR"
                  ? i.product.price_eur
                  : i.product.price_bgn,
            })),
            subtotal,
            shippingCost,
            total,
            currency,
            locale,
            researchConfirmed: true,
          }),
        });

        const data = await res.json();

        if (res.ok && data.url) {
          // Don't clear cart yet — user might cancel on Stripe
          window.location.href = data.url;
        } else {
          setApiError(data.error || "Payment error");
        }
      }
    } catch {
      setApiError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const isCodAvailable = formData.country === "Bulgaria";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* Section 1: Contact Information */}
      <section>
        <h2 className="text-lg font-semibold text-navy mb-4">{t("contact")}</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className={LABEL_CLASS}>
              {t("email")}
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={errors.email ? INPUT_ERROR_CLASS : INPUT_CLASS}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className={LABEL_CLASS}>
              {t("phone")}
            </label>
            <input
              id="phone"
              type="tel"
              required
              autoComplete="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className={errors.phone ? INPUT_ERROR_CLASS : INPUT_CLASS}
            />
            <p className="text-xs text-muted mt-1">{t("phoneNote")}</p>
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>
        </div>
      </section>

      {/* Section 2: Shipping Address */}
      <section>
        <h2 className="text-lg font-semibold text-navy mb-4">{t("shipping")}</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className={LABEL_CLASS}>
              {t("fullName")}
            </label>
            <input
              id="fullName"
              type="text"
              required
              autoComplete="name"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className={errors.fullName ? INPUT_ERROR_CLASS : INPUT_CLASS}
            />
            {errors.fullName && (
              <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label htmlFor="address" className={LABEL_CLASS}>
              {t("address")}
            </label>
            <input
              id="address"
              type="text"
              required
              autoComplete="address-line1"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className={errors.address ? INPUT_ERROR_CLASS : INPUT_CLASS}
            />
            {errors.address && (
              <p className="text-xs text-red-500 mt-1">{errors.address}</p>
            )}
          </div>

          <div>
            <label htmlFor="addressLine2" className={LABEL_CLASS}>
              {t("addressLine2")}
            </label>
            <input
              id="addressLine2"
              type="text"
              autoComplete="address-line2"
              value={formData.addressLine2}
              onChange={(e) => handleChange("addressLine2", e.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className={LABEL_CLASS}>
                {t("city")}
              </label>
              <input
                id="city"
                type="text"
                required
                autoComplete="address-level2"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                className={errors.city ? INPUT_ERROR_CLASS : INPUT_CLASS}
              />
              {errors.city && (
                <p className="text-xs text-red-500 mt-1">{errors.city}</p>
              )}
            </div>

            <div>
              <label htmlFor="postalCode" className={LABEL_CLASS}>
                {t("postalCode")}
              </label>
              <input
                id="postalCode"
                type="text"
                required
                autoComplete="postal-code"
                value={formData.postalCode}
                onChange={(e) => handleChange("postalCode", e.target.value)}
                className={errors.postalCode ? INPUT_ERROR_CLASS : INPUT_CLASS}
              />
              {errors.postalCode && (
                <p className="text-xs text-red-500 mt-1">{errors.postalCode}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="country" className={LABEL_CLASS}>
              {t("country")}
            </label>
            <select
              id="country"
              required
              autoComplete="country"
              value={formData.country}
              onChange={(e) => handleChange("country", e.target.value)}
              className={errors.country ? INPUT_ERROR_CLASS : INPUT_CLASS}
            >
              {EU_COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="text-xs text-red-500 mt-1">{errors.country}</p>
            )}
          </div>
        </div>
      </section>

      {/* Section 3: Payment Method */}
      <section>
        <h2 className="text-lg font-semibold text-navy mb-4">
          {t("paymentMethod")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setPaymentMethod("stripe")}
            className={`border-2 rounded-lg p-4 cursor-pointer text-left transition-colors ${
              paymentMethod === "stripe"
                ? "border-navy bg-surface"
                : "border-border bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-navy flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-navy">
                  {t("cardPayment")}
                </p>
                <p className="text-xs text-muted">{t("cardPaymentDesc")}</p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => isCodAvailable && setPaymentMethod("cod")}
            disabled={!isCodAvailable}
            className={`border-2 rounded-lg p-4 text-left transition-colors ${
              !isCodAvailable
                ? "border-border bg-white opacity-50 cursor-not-allowed"
                : paymentMethod === "cod"
                  ? "border-navy bg-surface cursor-pointer"
                  : "border-border bg-white cursor-pointer"
            }`}
          >
            <div className="flex items-center gap-3">
              <Banknote className="h-5 w-5 text-navy flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-navy">{t("cod")}</p>
                <p className="text-xs text-muted">{t("codDesc")}</p>
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* Section 4: Research Disclaimer */}
      <section>
        <label
          className={`flex items-start gap-3 cursor-pointer rounded-lg border p-4 ${
            errors.researchConfirm ? "border-red-400" : "border-border"
          }`}
        >
          <input
            type="checkbox"
            checked={researchConfirmed}
            onChange={(e) => {
              setResearchConfirmed(e.target.checked);
              if (e.target.checked && errors.researchConfirm) {
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.researchConfirm;
                  return next;
                });
              }
            }}
            className="mt-0.5 h-4 w-4 rounded border-border text-navy focus:ring-navy flex-shrink-0"
          />
          <span className="text-sm text-secondary leading-snug">
            {t("researchConfirm")}
          </span>
        </label>
        {errors.researchConfirm && (
          <p className="text-xs text-red-500 mt-1">{errors.researchConfirm}</p>
        )}
      </section>

      {/* Section 5: Terms & Conditions */}
      <section>
        <label
          className={`flex items-start gap-3 cursor-pointer rounded-lg border p-4 ${
            errors.termsAccepted ? "border-red-400" : "border-border"
          }`}
        >
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => {
              setTermsAccepted(e.target.checked);
              if (e.target.checked && errors.termsAccepted) {
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.termsAccepted;
                  return next;
                });
              }
            }}
            className="mt-0.5 h-4 w-4 rounded border-border text-navy focus:ring-navy flex-shrink-0"
          />
          <span className="text-sm text-secondary leading-snug">
            {t("termsAgreePrefix")}{" "}
            <Link href="/terms" className="text-navy underline hover:no-underline" target="_blank">
              {t("termsLink")}
            </Link>{" "}
            {t("termsAnd")}{" "}
            <Link href="/privacy" className="text-navy underline hover:no-underline" target="_blank">
              {t("privacyLink")}
            </Link>
          </span>
        </label>
        {errors.termsAccepted && (
          <p className="text-xs text-red-500 mt-1">{errors.termsAccepted}</p>
        )}
      </section>

      {/* API Error */}
      {apiError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {apiError}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-navy text-white py-4 rounded-lg font-semibold text-base mt-6 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
        {paymentMethod === "stripe" ? t("proceedToPayment") : t("placeOrder")}
      </button>
    </form>
  );
}
