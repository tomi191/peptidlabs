"use client";

import NumberFlow from "@number-flow/react";
import { eurToBgn } from "@/lib/money";

/**
 * Smoothly-transitioning EUR price + BGN dual display.
 * EUR is the primary currency; BGN is shown smaller for the legally
 * required transition-period dual display (Bulgaria — 1.95583 fixed rate).
 */
export function AnimatedPrice({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex flex-col items-start leading-tight ${className ?? ""}`}>
      <NumberFlow
        value={value}
        format={{ style: "currency", currency: "EUR" }}
      />
      <span className="mt-1 font-mono text-xs text-muted tabular">
        ≈ <NumberFlow value={eurToBgn(value)} format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} /> лв
      </span>
    </span>
  );
}
