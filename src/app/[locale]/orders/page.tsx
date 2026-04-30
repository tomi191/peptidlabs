"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { Search, Package, Mail, MessageCircle } from "lucide-react";

export default function OrderLookupPage() {
  const t = useTranslations("orders");
  const router = useRouter();
  const locale = useLocale();
  const isBg = locale === "bg";
  const [orderId, setOrderId] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = orderId.trim();
    if (!trimmed) return;
    router.push(`/orders/${trimmed}`);
  }

  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto max-w-[1280px] px-6 pt-10 pb-16">
        {/* Breadcrumb */}
        <nav className="text-xs text-muted mb-6">
          <Link href="/" className="hover:text-teal-600">
            {isBg ? "Начало" : "Home"}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-navy">{t("trackTitle")}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-navy tracking-[-0.03em]">
              {t("trackTitle")}
            </h1>
            <p className="mt-4 text-secondary leading-relaxed max-w-xl">
              {isBg
                ? "Въведете номера на поръчката (в имейла за потвърждение) за да видите текущия статус, номер за проследяване и съдържание."
                : "Enter the order number (in your confirmation email) to see the current status, tracking number and contents."}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 max-w-md">
              <label
                htmlFor="orderId"
                className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2"
              >
                {t("enterOrderId")}
              </label>
              <div className="relative">
                <input
                  id="orderId"
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="a1b2c3d4-…"
                  className="w-full rounded-xl border border-border bg-white pl-4 pr-14 py-3.5 text-sm font-mono text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!orderId.trim()}
                  className="absolute right-1.5 top-1.5 inline-flex items-center justify-center gap-2 bg-navy text-white h-[calc(100%-12px)] px-4 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Search className="h-4 w-4" strokeWidth={1.5} />
                  <span className="hidden sm:inline">{t("track")}</span>
                </button>
              </div>
              <p className="mt-3 text-xs text-muted">
                {isBg
                  ? "Номерът изглежда като: a1b2c3d4-e5f6-… (получавате го в имейла след плащане)."
                  : "Format: a1b2c3d4-e5f6-… (found in your confirmation email)."}
              </p>
            </form>

            {/* Status legend */}
            <div className="mt-10 grid gap-3 sm:grid-cols-2 max-w-xl">
              <div className="rounded-xl border border-border p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  {isBg ? "Статуси" : "Statuses"}
                </p>
                <ul className="mt-2 space-y-1.5 text-sm text-secondary">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    {isBg ? "Обработва се" : "Processing"}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    {isBg ? "Изпратена" : "Shipped"}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-teal-500" />
                    {isBg ? "Доставена" : "Delivered"}
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-border p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  {isBg ? "Уведомления" : "Notifications"}
                </p>
                <p className="mt-2 text-sm text-secondary leading-relaxed">
                  {isBg
                    ? "Изпращаме имейл за всяка промяна в статуса — включително номер за проследяване и връзка към куриера."
                    : "We email you every time the status changes — including the tracking number and courier link."}
                </p>
              </div>
            </div>
          </div>

          {/* Right — help sidebar */}
          <aside className="lg:sticky lg:top-24 space-y-4">
            <div className="rounded-xl border border-border p-5">
              <Package size={18} className="text-teal-600 mb-3" />
              <h3 className="text-sm font-semibold text-navy mb-2">
                {isBg ? "Не намирате номера?" : "Lost your order number?"}
              </h3>
              <p className="text-xs text-secondary leading-relaxed mb-3">
                {isBg
                  ? "Проверете имейла за потвърждение или пишете на нашия екип — отговаряме в рамките на 24 часа."
                  : "Check your confirmation email or contact our team — we reply within 24 hours."}
              </p>
              <div className="space-y-2">
                <a
                  href="mailto:support@peptidlabs.eu"
                  className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700"
                >
                  <Mail size={14} strokeWidth={1.5} />
                  support@peptidlabs.eu
                </a>
                <a
                  href="https://wa.me/359XXXXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700"
                >
                  <MessageCircle size={14} strokeWidth={1.5} />
                  WhatsApp
                </a>
              </div>
            </div>
            <div className="rounded-xl border border-dashed border-border bg-surface p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">
                {isBg ? "Полезно" : "Helpful"}
              </p>
              <ul className="space-y-1.5 text-sm">
                <li>
                  <Link
                    href="/delivery"
                    className="text-navy hover:text-teal-600"
                  >
                    {isBg ? "Срокове за доставка →" : "Shipping times →"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/returns"
                    className="text-navy hover:text-teal-600"
                  >
                    {isBg ? "Връщане на поръчка →" : "Return policy →"}
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-navy hover:text-teal-600">
                    {isBg ? "Често задавани въпроси →" : "FAQ →"}
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
