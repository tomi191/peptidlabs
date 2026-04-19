"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AdminStore = {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
};

export const useAdmin = create<AdminStore>()(
  persist(
    (set, get) => ({
      token: null,

      setToken: (token) => set({ token }),

      logout: () => set({ token: null }),

      isAuthenticated: () => {
        const t = get().token;
        return t !== null && t.length > 0;
      },
    }),
    {
      name: "peptidelab-admin",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
