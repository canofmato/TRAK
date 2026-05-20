import { create } from "zustand";
import { TripTab } from "@/types/trip";
import { persist } from "zustand/middleware";

const MAX_TABS = 4;

interface TabState {
  tabs: TripTab[];
  activeSlug: string | null;
  pinTab: (trip: TripTab) => void;
  removeTab: (tripSlug: string) => void;
  setActive: (tripSlug: string) => void;
}

export const useTabStore = create<TabState>() (
  persist(
    (set) => ({
      tabs: [],
      activeSlug: null,

      pinTab: (trip) =>
        set((state) => {
          const isDuplicate = state.tabs.some((t) => t.tripSlug === trip.tripSlug)
          if (isDuplicate) return { activeSlug: trip.tripSlug }

          const next =
            state.tabs.length >= MAX_TABS
              ? [...state.tabs.slice(1), trip]
              : [...state.tabs, trip]
          return { tabs: next, activeSlug: trip.tripSlug }
        }),

      removeTab: (tripSlug) =>
        set((state) => {
          const next = state.tabs.filter((t) => t.tripSlug !== tripSlug)
          const activeSlug =
            state.activeSlug === tripSlug
              ? (next.at(-1)?.tripSlug ?? null)
              : state.activeSlug
          return { tabs: next, activeSlug }
        }),
        
      setActive: (tripSlug) => set({ activeSlug: tripSlug }),
    }),
    { name: 'trak-tabs' }
  )
)