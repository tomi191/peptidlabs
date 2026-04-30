import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_COMPARE = 4;

type CompareStore = {
  /** Set of product slugs the user wants to compare (max 4) */
  slugs: string[];
  toggle: (slug: string) => { ok: true } | { ok: false; reason: "max" };
  remove: (slug: string) => void;
  has: (slug: string) => boolean;
  count: () => number;
  clear: () => void;
};

export const MAX_COMPARE_ITEMS = MAX_COMPARE;

export const useCompare = create<CompareStore>()(
  persist(
    (set, get) => ({
      slugs: [],

      toggle: (slug) => {
        const state = get();
        if (state.slugs.includes(slug)) {
          set({ slugs: state.slugs.filter((s) => s !== slug) });
          return { ok: true };
        }
        if (state.slugs.length >= MAX_COMPARE) {
          return { ok: false, reason: "max" as const };
        }
        set({ slugs: [...state.slugs, slug] });
        return { ok: true };
      },

      remove: (slug) =>
        set((state) => ({ slugs: state.slugs.filter((s) => s !== slug) })),

      has: (slug) => get().slugs.includes(slug),

      count: () => get().slugs.length,

      clear: () => set({ slugs: [] }),
    }),
    {
      name: "peptidlab-compare",
      version: 1,
    },
  ),
);
