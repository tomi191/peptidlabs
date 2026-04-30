"use client";

/* Haptic feedback for native-app feel.
   No-op when Vibration API or user-activation isn't available. */

type Pattern = "tap" | "select" | "success" | "warning" | "error" | "long";

const PATTERNS: Record<Pattern, number | number[]> = {
  tap: 6,
  select: 10,
  success: [10, 30, 12],
  warning: [16, 60, 16],
  error: [22, 40, 22, 40, 22],
  long: 18,
};

export function haptic(pattern: Pattern = "tap") {
  if (typeof window === "undefined") return;
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  try {
    navigator.vibrate(PATTERNS[pattern]);
  } catch {
    /* no-op */
  }
}

export function useHaptics() {
  return haptic;
}
