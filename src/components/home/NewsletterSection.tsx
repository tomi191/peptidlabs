"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function NewsletterSection() {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="w-full bg-surface py-16 px-6">
      <div className="mx-auto max-w-lg text-center">
        <h2 className="text-xl font-semibold text-navy">{t("title")}</h2>
        <p className="mt-2 text-sm text-secondary">{t("subtitle")}</p>

        {status === "success" ? (
          <p className="mt-6 text-sm font-medium text-accent">{t("success")}</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("placeholder")}
              className="flex-1 rounded-lg border border-border bg-white px-4 py-3 text-sm text-navy placeholder:text-muted focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy/90 disabled:opacity-50"
            >
              {t("subscribe")}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="mt-3 text-sm text-red-600">{t("error")}</p>
        )}
      </div>
    </section>
  );
}
