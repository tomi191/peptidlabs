"use client";

import NumberFlow from "@number-flow/react";

/**
 * Smoothly-transitioning EUR price. Semantic: signals that the value
 * actually changed (size variant switch, quantity, promo code) rather
 * than just re-rendered.
 */
export function AnimatedPrice({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <NumberFlow
      value={value}
      format={{ style: "currency", currency: "EUR" }}
      className={className}
    />
  );
}
