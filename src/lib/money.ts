/**
 * Money helpers for the BGN/EUR transition period.
 *
 * Bulgaria adopted the EUR on 2026-01-01. Per the changeover law, retailers
 * must show BOTH currencies for at least 12 months at the fixed rate
 * 1.95583 BGN = 1 EUR. EUR is the primary currency; BGN is informational.
 *
 * Usage:
 *   formatEur(price.price_eur)             → "€24.90"
 *   formatBgn(price.price_eur)             → "48.70 лв" (computed from EUR)
 *   formatBgnFromBgn(price.price_bgn)      → "48.70 лв" (uses DB BGN value)
 *   <DualPrice eur={24.90} />              → React component (see ui/DualPrice)
 */

export const EUR_BGN_RATE = 1.95583;

/** Format a number as EUR with 2 decimals: "€24.90". */
export function formatEur(eur: number): string {
  return `€${eur.toFixed(2)}`;
}

/**
 * Convert an EUR amount to BGN at the fixed rate and format: "48.70 лв".
 * Per Bulgarian Currency Conversion Act, intermediate calculations use the
 * full 1.95583 rate and the result is rounded to 2 decimal stotinki.
 */
export function eurToBgn(eur: number): number {
  return Math.round(eur * EUR_BGN_RATE * 100) / 100;
}

export function formatBgn(eur: number): string {
  const bgn = eurToBgn(eur);
  return `${bgn.toFixed(2)} лв`;
}

/** When the DB already stores price_bgn, prefer that to avoid drift. */
export function formatBgnFromBgn(bgn: number): string {
  return `${bgn.toFixed(2)} лв`;
}
