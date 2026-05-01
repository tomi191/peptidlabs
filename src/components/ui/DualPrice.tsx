import { formatEur, formatBgn, formatBgnFromBgn } from "@/lib/money";

type Size = "sm" | "md" | "lg" | "xl";

type Props = {
  /** Price in EUR — primary, always shown. */
  eur: number;
  /**
   * Optional explicit BGN value (from products.price_bgn). When provided,
   * it is used verbatim; otherwise the BGN is computed from `eur` at the
   * fixed 1.95583 rate.
   */
  bgn?: number;
  /** Visual size of the EUR price. BGN scales relatively. */
  size?: Size;
  /** Use mono font for the EUR (good for product cards / detail). */
  mono?: boolean;
  className?: string;
};

const eurSizeClass: Record<Size, string> = {
  sm: "text-sm font-semibold",
  md: "text-base font-bold",
  lg: "text-2xl font-bold",
  xl: "text-3xl md:text-4xl font-bold",
};

const bgnSizeClass: Record<Size, string> = {
  sm: "text-[10px]",
  md: "text-[11px]",
  lg: "text-xs",
  xl: "text-sm",
};

/**
 * DualPrice — EUR primary + BGN informational, per Bulgarian transition law.
 * BGN is rendered in a smaller, muted style underneath / next to EUR.
 *
 * EUR is always the source of truth (Bulgaria is in the eurozone since 2026).
 * BGN exists only for the legally required 12-month dual-display period.
 */
export function DualPrice({
  eur,
  bgn,
  size = "md",
  mono,
  className,
}: Props) {
  const bgnText = bgn != null ? formatBgnFromBgn(bgn) : formatBgn(eur);
  return (
    <span
      className={`inline-flex flex-col items-end leading-tight ${className ?? ""}`}
    >
      <span
        className={`text-navy ${eurSizeClass[size]} ${mono ? "font-mono tabular" : "tabular"}`}
      >
        {formatEur(eur)}
      </span>
      <span
        className={`mt-0.5 font-mono text-muted tabular ${bgnSizeClass[size]}`}
        aria-label={`Equivalent in Bulgarian leva: ${bgnText}`}
      >
        ≈ {bgnText}
      </span>
    </span>
  );
}

/** Inline variant — EUR · BGN on one line (use in tight spaces like cart). */
export function DualPriceInline({
  eur,
  bgn,
  className,
}: Pick<Props, "eur" | "bgn" | "className">) {
  const bgnText = bgn != null ? formatBgnFromBgn(bgn) : formatBgn(eur);
  return (
    <span className={`inline-flex items-baseline gap-1.5 ${className ?? ""}`}>
      <span className="font-bold text-navy tabular">{formatEur(eur)}</span>
      <span className="font-mono text-[11px] text-muted tabular">
        · {bgnText}
      </span>
    </span>
  );
}
