import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistStore = {
  /** Set of product slugs that the user has saved */
  slugs: string[];
  toggle: (slug: string) => void;
  add: (slug: string) => void;
  remove: (slug: string) => void;
  has: (slug: string) => boolean;
  count: () => number;
  clear: () => void;
};

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      slugs: [],

      toggle: (slug) =>
        set((state) => {
          const exists = state.slugs.includes(slug);
          return { slugs: exists ? state.slugs.filter((s) => s !== slug) : [...state.slugs, slug] };
        }),

      add: (slug) =>
        set((state) =>
          state.slugs.includes(slug) ? state : { slugs: [...state.slugs, slug] },
        ),

      remove: (slug) =>
        set((state) => ({ slugs: state.slugs.filter((s) => s !== slug) })),

      has: (slug) => get().slugs.includes(slug),

      count: () => get().slugs.length,

      clear: () => set({ slugs: [] }),
    }),
    {
      name: "peptidlab-wishlist",
      version: 1,
    },
  ),
);
