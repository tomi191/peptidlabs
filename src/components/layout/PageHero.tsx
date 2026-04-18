import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";

type Crumb = { label: string; href?: string };

type Props = {
  crumbs: Crumb[];
  marker: string; // e.g. "[ABOUT/01] МИСИЯ"
  title: string;
  subtitle?: string;
  /** Right-side content — lab badges, key facts, placeholder visual */
  aside?: ReactNode;
  locale: string;
};

/**
 * Consistent page header used across the site.
 * - Breadcrumb
 * - Lab-coordinate marker (mono uppercase)
 * - Large display heading
 * - Optional aside (right-aligned desktop, stacked mobile)
 */
export function PageHero({
  crumbs,
  marker,
  title,
  subtitle,
  aside,
  locale,
}: Props) {
  return (
    <div className="mx-auto max-w-[1280px] px-6 pt-10 pb-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-muted mb-6" aria-label="breadcrumb">
        <Link href="/" className="hover:text-teal-600">
          {locale === "bg" ? "Начало" : "Home"}
        </Link>
        {crumbs.map((c, i) => (
          <span key={i}>
            <span className="mx-2">/</span>
            {c.href ? (
              <Link href={c.href} className="hover:text-teal-600">
                {c.label}
              </Link>
            ) : (
              <span className="text-navy">{c.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* Hero row */}
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div className="max-w-2xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
            {marker}
          </p>
          <h1 className="mt-2 font-display text-3xl md:text-4xl font-bold text-navy tracking-[-0.03em]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 text-secondary leading-relaxed">{subtitle}</p>
          )}
        </div>
        {aside && <div className="shrink-0">{aside}</div>}
      </div>
    </div>
  );
}
