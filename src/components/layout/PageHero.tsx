import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";

type Crumb = { label: string; href?: string };

type Props = {
  crumbs: Crumb[];
  /** Optional small label above title — currently unused, kept for compat */
  marker?: string;
  title: string;
  subtitle?: string;
  aside?: ReactNode;
  locale: string;
};

export function PageHero({
  crumbs,
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

      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div className="max-w-2xl">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-navy tracking-[-0.03em]">
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
