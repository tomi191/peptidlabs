"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const NEWSLETTER_BG = SUPABASE_URL
  ? `${SUPABASE_URL}/storage/v1/object/public/product-images/newsletter/banner.png`
  : null;

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
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
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
    <section className="relative w-full overflow-hidden">
      {NEWSLETTER_BG && (
        <>
          <Image
            src={NEWSLETTER_BG}
            alt=""
            fill
            sizes="100vw"
            quality={85}
            className="object-cover"
            aria-hidden="true"
          />
          {/* Dark overlay for text legibility */}
          <div className="absolute inset-0 bg-navy/75" aria-hidden="true" />
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-navy/10 to-navy/40"
            aria-hidden="true"
          />
        </>
      )}

      <div className="relative px-6 py-20">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="text-2xl font-bold text-white md:text-3xl">{t("title")}</h2>
          <p className="mt-3 text-sm text-white/80">{t("subtitle")}</p>

          {status === "success" ? (
            <p className="mt-6 text-sm font-medium text-white">{t("success")}</p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 flex gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("placeholder")}
                className="flex-1 rounded-lg border border-white/30 bg-white/95 backdrop-blur-sm px-4 py-3 text-sm text-navy placeholder:text-muted focus:border-accent focus:outline-none focus:bg-white"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
              >
                {t("subscribe")}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="mt-3 text-sm text-red-300">{t("error")}</p>
          )}
        </div>
      </div>
    </section>
  );
}
