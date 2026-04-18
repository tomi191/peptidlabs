/**
 * Loyalty rewards utilities.
 * 1 point per €1 spent. Tiers: bronze (<50), silver (50-199), gold (>=200).
 * Redemption: 100 points = €5 discount (displayed only for now — no redeem flow).
 */

export type RewardTier = "bronze" | "silver" | "gold";

export type UserRewards = {
  email: string;
  points: number;
  total_spent: number;
  tier: RewardTier;
  created_at: string;
  updated_at: string;
};

export const POINTS_PER_EUR = 1;
export const REDEEM_POINTS = 100;
export const REDEEM_VALUE_EUR = 5;

export const TIER_THRESHOLDS = {
  silver: 50,
  gold: 200,
} as const;

export function computeTier(points: number): RewardTier {
  if (points >= TIER_THRESHOLDS.gold) return "gold";
  if (points >= TIER_THRESHOLDS.silver) return "silver";
  return "bronze";
}

export function pointsToNextTier(points: number): {
  nextTier: RewardTier | null;
  pointsRemaining: number;
} {
  if (points < TIER_THRESHOLDS.silver) {
    return {
      nextTier: "silver",
      pointsRemaining: TIER_THRESHOLDS.silver - points,
    };
  }
  if (points < TIER_THRESHOLDS.gold) {
    return {
      nextTier: "gold",
      pointsRemaining: TIER_THRESHOLDS.gold - points,
    };
  }
  return { nextTier: null, pointsRemaining: 0 };
}

export function pointsFromOrderTotal(totalEur: number): number {
  if (!Number.isFinite(totalEur) || totalEur <= 0) return 0;
  return Math.floor(totalEur * POINTS_PER_EUR);
}
