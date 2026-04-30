"use client";

import { useState, useTransition } from "react";
import { useLocale } from "next-intl";
import { CheckCircle2, Mail, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type Variant = "hero" | "inline" | "card";

type Props = {
  variant?: Variant;
  source?: string;
  /** Pre-fill with peptide slug (used on product pages for "notify me about X") */
  interestedPeptide?: string;
  /** Override default title and subtitle */
  title?: string;
  subtitle?: string;
  cta?: string;
};

export function WaitlistForm({
  variant = "card",
  source,
  interestedPeptide,
  title,
  subtitle,
  cta,
}: Props) {
  const locale = useLocale();
  const isBg = locale === "bg";
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [pending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const labels = {
    title:
      title ??
      (isBg ? "Бъди първи, когато сме готови" : "Be first when we launch"),
    subtitle:
      subtitle ??
      (isBg
        ? "Подготвяме каталога за пускане. Запиши се с имейл и ще те уведомим веднага щом продуктите станат достъпни за поръчка."
        : "We are preparing the catalog for launch. Enter your email and we will notify you the moment products become orderable."),
    placeholder: isBg ? "вашият@имейл.bg" : "your@email.com",
    cta: cta ?? (isBg ? "Запиши ме в списъка" : "Add me to the list"),
    successTitle: isBg ? "Записан си в списъка!" : "You are on the list!",
    successDesc: isBg
      ? "Ще ти изпратим имейл, когато стартираме продажбите. Без спам, обещаваме."
      : "We will email you the moment sales open. No spam, ever.",
    privacy: isBg
      ? "С това приемаш да получаваш имейли от нас. Можеш да се отпишеш по всяко време."
      : "By submitting you agree to receive emails. Unsubscribe any time.",
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/waitlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            locale,
            interestedPeptides: interestedPeptide ? [interestedPeptide] : [],
            source,
            honeypot,
          }),
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          setError(
            json?.error ??
              (isBg
                ? "Записът се провали. Опитай отново."
                : "Sign-up failed. Try again.")
          );
          return;
        }

        setSuccess(true);
        setEmail("");
      } catch {
        setError(
          isBg ? "Мрежова грешка." : "Network error."
        );
      }
    });
  }

  // Success state — celebrate
  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={
          variant === "hero"
            ? "rounded-2xl bg-emerald-50 border border-emerald-200 p-7 text-center"
            : variant === "inline"
              ? "rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center"
              : "rounded-xl bg-emerald-50 border border-emerald-200 p-5 text-center"
        }
      >
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white mb-3">
          <CheckCircle2 size={20} strokeWidth={2} />
        </div>
        <h3 className="font-display text-lg font-bold text-emerald-900 mb-1">
          {labels.successTitle}
        </h3>
        <p className="text-sm text-emerald-800 leading-relaxed">
          {labels.successDesc}
        </p>
      </motion.div>
    );
  }

  // Hero variant — large, centered, full-width form
  if (variant === "hero") {
    return (
      <div className="w-full max-w-2xl">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-navy mb-3 tracking-[-0.02em]">
          {labels.title}
        </h2>
        <p className="text-secondary leading-relaxed mb-6">{labels.subtitle}</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <Honeypot value={honeypot} onChange={setHoneypot} />
          <div className="relative flex-1">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={labels.placeholder}
              className="w-full rounded-xl border border-border bg-white pl-11 pr-4 py-3.5 text-base text-navy placeholder:text-muted focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/10"
              disabled={pending}
            />
          </div>
          <SubmitButton pending={pending} label={labels.cta} variant="hero" />
        </form>
        {error && (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <p className="mt-3 text-xs text-muted">{labels.privacy}</p>
      </div>
    );
  }

  // Inline variant — compact, single row
  if (variant === "inline") {
    return (
      <form onSubmit={handleSubmit} className="space-y-2">
        <Honeypot value={honeypot} onChange={setHoneypot} />
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={labels.placeholder}
            className="flex-1 rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-navy placeholder:text-muted focus:border-navy focus:outline-none"
            disabled={pending}
          />
          <SubmitButton pending={pending} label={labels.cta} variant="inline" />
        </div>
        {error && (
          <p className="text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
      </form>
    );
  }

  // Card variant (default) — boxed with title
  return (
    <div className="rounded-2xl border border-border bg-white p-6">
      <div className="flex items-center gap-2 mb-3">
        <Mail size={16} className="text-accent" />
        <h3 className="font-display text-base font-bold text-navy">
          {labels.title}
        </h3>
      </div>
      <p className="text-sm text-secondary leading-relaxed mb-4">
        {labels.subtitle}
      </p>
      <form onSubmit={handleSubmit} className="space-y-2">
        <Honeypot value={honeypot} onChange={setHoneypot} />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={labels.placeholder}
          className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-navy placeholder:text-muted focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/10"
          disabled={pending}
        />
        <SubmitButton pending={pending} label={labels.cta} variant="card" />
        {error && (
          <p className="text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
        <p className="text-[11px] text-muted leading-relaxed">{labels.privacy}</p>
      </form>
    </div>
  );
}

function SubmitButton({
  pending,
  label,
  variant,
}: {
  pending: boolean;
  label: string;
  variant: Variant;
}) {
  const sizing =
    variant === "hero"
      ? "px-6 py-3.5 text-base"
      : variant === "inline"
        ? "px-4 py-2.5 text-sm"
        : "w-full px-4 py-2.5 text-sm";

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-navy text-white font-semibold hover:bg-navy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 ${sizing}`}
    >
      <AnimatePresence mode="wait">
        {pending ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="inline-flex items-center gap-2"
          >
            <Loader2 size={16} className="animate-spin" />
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="inline-flex items-center gap-2"
          >
            {label}
            <ArrowRight size={16} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

function Honeypot({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type="text"
      name="website"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="absolute -left-[9999px] opacity-0 pointer-events-none"
    />
  );
}
