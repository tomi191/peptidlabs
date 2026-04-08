"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function NewsletterSignup() {
  const t = useTranslations("blog");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("done");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="text-sm text-teal-600 font-medium">{t("subscribed")}</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("emailPlaceholder")}
        className="flex-1 rounded-lg border border-border px-3 py-2 text-sm text-navy placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-teal-600"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 transition-colors disabled:opacity-50"
      >
        {t("subscribeButton")}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-600 mt-1">{t("subscribeError")}</p>
      )}
    </form>
  );
}
