"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Mail, Loader2, CircleCheck } from "lucide-react";

type Status = "idle" | "sending" | "sent" | "error" | "rate_limited";

export default function RequestLinkForm() {
  const t = useTranslations("account");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^\S+@\S+\.\S+$/.test(trimmed)) {
      setStatus("error");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/account/request-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, locale }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        if (res.status === 429) {
          setStatus("rate_limited");
          return;
        }
        setStatus("error");
        return;
      }
      if (json?.success) {
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-6 max-w-md">
        <div className="flex items-start gap-3">
          <CircleCheck
            className="h-5 w-5 text-teal-600 shrink-0 mt-0.5"
            strokeWidth={1.5}
          />
          <div>
            <p className="text-sm font-semibold text-navy">{t("linkSent")}</p>
            <p className="mt-1 text-sm text-secondary leading-relaxed">
              {t("linkSentDetail")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md">
      <label
        htmlFor="account-email"
        className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2"
      >
        {t("emailLabel")}
      </label>
      <div className="relative">
        <Mail
          className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted"
          strokeWidth={1.5}
        />
        <input
          id="account-email"
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error" || status === "rate_limited") {
              setStatus("idle");
            }
          }}
          placeholder={t("emailPlaceholder")}
          className="w-full rounded-xl border border-border bg-white pl-11 pr-4 py-3.5 text-sm text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
          autoComplete="email"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-4 inline-flex items-center justify-center gap-2 bg-navy text-white px-5 py-3 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed w-full sm:w-auto"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
            {t("sending")}
          </>
        ) : (
          <>
            <Mail className="h-4 w-4" strokeWidth={1.5} />
            {t("sendLink")}
          </>
        )}
      </button>

      {status === "rate_limited" && (
        <p className="mt-3 text-sm text-amber-700">{t("rateLimited")}</p>
      )}
      {status === "error" && (
        <p className="mt-3 text-sm text-red-600">{t("requestError")}</p>
      )}

      <p className="mt-4 text-xs text-muted leading-relaxed">
        {t("linkExpiryNote")}
      </p>
    </form>
  );
}
