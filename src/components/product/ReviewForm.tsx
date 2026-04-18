"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Loader2, Star, Send } from "lucide-react";

type Props = {
  productId: string;
  locale: string;
};

type FormState = "idle" | "submitting";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ReviewForm({ productId, locale }: Props) {
  const t = useTranslations("reviews");
  const isBg = locale === "bg";

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [orderId, setOrderId] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);

  const ratingLabels = [
    t("rating1"),
    t("rating2"),
    t("rating3"),
    t("rating4"),
    t("rating5"),
  ];

  function validate(): string | null {
    if (rating < 1 || rating > 5) return t("errorRatingRequired");
    if (authorName.trim().length < 2) return t("errorNameRequired");
    if (!EMAIL_REGEX.test(authorEmail.trim())) return t("errorEmailInvalid");
    if (text.trim().length < 10) return t("errorTextTooShort");
    if (text.trim().length > 2000) return t("errorTextTooLong");
    if (title && title.trim().length > 0 && title.trim().length < 5)
      return t("errorTitleTooShort");
    if (orderId && orderId.trim().length > 0 && !UUID_REGEX.test(orderId.trim()))
      return t("errorOrderIdInvalid");
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "submitting") return;

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }
    setError(null);

    setState("submitting");

    const payload: Record<string, unknown> = {
      productId,
      rating,
      text: text.trim(),
      authorName: authorName.trim(),
      authorEmail: authorEmail.trim(),
      honeypot,
    };
    const trimmedTitle = title.trim();
    if (trimmedTitle.length > 0) payload.title = trimmedTitle;
    const trimmedOrderId = orderId.trim();
    if (trimmedOrderId.length > 0) payload.orderId = trimmedOrderId;

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = (await res.json()) as
        | { success: true; data: unknown }
        | { success: false; error: string };

      if (!res.ok || !json.success) {
        const message =
          (json as { success: false; error: string }).error || t("error");
        toast.error(message);
        setError(message);
        setState("idle");
        return;
      }

      toast.success(t("thanks"));
      // Reset form
      setRating(0);
      setHoverRating(0);
      setTitle("");
      setText("");
      setAuthorName("");
      setAuthorEmail("");
      setOrderId("");
      setHoneypot("");
      setState("idle");
    } catch (err) {
      console.error("Review submit failed:", err);
      toast.error(t("error"));
      setError(t("error"));
      setState("idle");
    }
  }

  const activeRating = hoverRating || rating;

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Rating */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
          {t("ratingLabel")}
        </label>
        <div className="mt-2 flex items-center gap-1" role="radiogroup">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={rating === i}
              aria-label={ratingLabels[i - 1]}
              onClick={() => setRating(i)}
              onMouseEnter={() => setHoverRating(i)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                size={26}
                className={
                  i <= activeRating
                    ? "fill-amber-400 text-amber-400"
                    : "fill-transparent text-border"
                }
              />
            </button>
          ))}
          {activeRating > 0 && (
            <span className="ml-2 text-sm font-semibold text-navy">
              {ratingLabels[activeRating - 1]}
            </span>
          )}
        </div>
      </div>

      {/* Title (optional) */}
      <Field
        id="review-title"
        label={t("titleField")}
        value={title}
        onChange={setTitle}
        maxLength={100}
        optional={isBg ? "(по избор)" : "(optional)"}
      />

      {/* Text */}
      <div>
        <label
          htmlFor="review-text"
          className="block text-xs font-semibold uppercase tracking-wide text-muted"
        >
          {t("textField")}
        </label>
        <textarea
          id="review-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          maxLength={2000}
          required
          className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-navy outline-none transition-colors focus:border-navy focus:ring-1 focus:ring-navy"
        />
        <p className="mt-1 text-right font-mono text-[10px] text-muted">
          {text.length}/2000
        </p>
      </div>

      {/* Author name */}
      <Field
        id="review-name"
        label={t("authorField")}
        value={authorName}
        onChange={setAuthorName}
        maxLength={60}
        required
      />

      {/* Email */}
      <Field
        id="review-email"
        type="email"
        label={t("emailField")}
        value={authorEmail}
        onChange={setAuthorEmail}
        maxLength={255}
        required
        helper={t("emailHelper")}
      />

      {/* Order ID (optional) */}
      <Field
        id="review-order"
        label={t("orderIdField")}
        value={orderId}
        onChange={setOrderId}
        maxLength={36}
        optional={isBg ? "(по избор)" : "(optional)"}
        helper={t("orderIdHelper")}
      />

      {/* Honeypot: hidden from real users, bots fill it */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        <label htmlFor="review-website">Website</label>
        <input
          id="review-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {error && (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}

      <motion.button
        type="submit"
        disabled={state === "submitting"}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-navy py-3 text-sm font-semibold text-white transition-colors hover:bg-navy/90 disabled:opacity-60"
      >
        {state === "submitting" ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            {t("submitting")}
          </>
        ) : (
          <>
            <Send size={16} />
            {t("submitReview")}
          </>
        )}
      </motion.button>

      <p className="text-[11px] text-muted">{t("moderationNote")}</p>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  maxLength,
  required,
  optional,
  helper,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "email";
  maxLength?: number;
  required?: boolean;
  optional?: string;
  helper?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-semibold uppercase tracking-wide text-muted"
      >
        {label}{" "}
        {optional && (
          <span className="font-normal normal-case text-muted">{optional}</span>
        )}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        required={required}
        className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-navy outline-none transition-colors focus:border-navy focus:ring-1 focus:ring-navy"
      />
      {helper && <p className="mt-1 text-[11px] text-muted">{helper}</p>}
    </div>
  );
}
