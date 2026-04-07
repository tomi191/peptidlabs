"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Search } from "lucide-react";

export default function OrderLookupPage() {
  const t = useTranslations("orders");
  const router = useRouter();
  const [orderId, setOrderId] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = orderId.trim();
    if (!trimmed) return;
    router.push(`/orders/${trimmed}`);
  }

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-2">
          <Search className="h-10 w-10 text-accent mx-auto" strokeWidth={1.5} />
          <h1 className="text-2xl font-semibold text-navy">
            {t("trackTitle")}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="orderId" className="sr-only">
              {t("enterOrderId")}
            </label>
            <input
              id="orderId"
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder={t("enterOrderId")}
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm font-mono text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            disabled={!orderId.trim()}
            className="w-full inline-flex items-center justify-center gap-2 bg-navy text-white py-3 px-6 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Search className="h-4 w-4" />
            {t("track")}
          </button>
        </form>
      </div>
    </main>
  );
}
