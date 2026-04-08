"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function ContactForm() {
  const t = useTranslations("contact");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="border border-border rounded-lg p-8 text-center">
        <p className="text-navy font-medium">{t("thankYou")}</p>
        <p className="text-sm text-muted mt-2">{t("thankYouSub")}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="space-y-4"
    >
      <div>
        <label
          htmlFor="contact-name"
          className="block text-sm font-medium text-navy mb-1"
        >
          {t("nameLabel")}
        </label>
        <input
          id="contact-name"
          type="text"
          required
          className="w-full rounded-lg border border-border px-3 py-2 text-sm text-navy placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-teal-600"
        />
      </div>
      <div>
        <label
          htmlFor="contact-email"
          className="block text-sm font-medium text-navy mb-1"
        >
          {t("emailLabel")}
        </label>
        <input
          id="contact-email"
          type="email"
          required
          className="w-full rounded-lg border border-border px-3 py-2 text-sm text-navy placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-teal-600"
        />
      </div>
      <div>
        <label
          htmlFor="contact-subject"
          className="block text-sm font-medium text-navy mb-1"
        >
          {t("subjectLabel")}
        </label>
        <input
          id="contact-subject"
          type="text"
          required
          className="w-full rounded-lg border border-border px-3 py-2 text-sm text-navy placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-teal-600"
        />
      </div>
      <div>
        <label
          htmlFor="contact-message"
          className="block text-sm font-medium text-navy mb-1"
        >
          {t("messageLabel")}
        </label>
        <textarea
          id="contact-message"
          rows={5}
          required
          className="w-full rounded-lg border border-border px-3 py-2 text-sm text-navy placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-teal-600 resize-none"
        />
      </div>
      <button
        type="submit"
        className="rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
      >
        {t("sendButton")}
      </button>
    </form>
  );
}
