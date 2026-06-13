import { create } from "zustand";
import type { TripTab } from "@/types/trip";
import { persist } from "zustand/middleware";

const MAX_TABS = 4;

interface TabState {
  tabs: TripTab[];
  activeSlug: string | null;
  activeUserId: string | null;
  setActiveUser: (userId: string | null) => void;
  pinTab: (trip: TripTab) => void;
  removeTab: (tripSlug: string) => void;
  setActive: (tripSlug: string) => void;
  clearTabs: () => void;
}

export const useTabStore = create<TabState>() (
  persist(
    (set) => ({
      tabs: [],
      activeSlug: null,
      activeUserId: null,

      setActiveUser: (userId) =>
        set((state) => {
          const tabs = state.tabs.filter((tab) => tab.userId === userId)
          const activeSlug = tabs.some((tab) => tab.tripSlug === state.activeSlug)
            ? state.activeSlug
            : null

          return { activeUserId: userId, tabs, activeSlug }
        }),

      pinTab: (trip) =>
        set((state) => {
          const isDuplicate = state.tabs.some((t) => t.tripSlug === trip.tripSlug)

          // ✅ 중복이면 해당 탭 내용(색상, 제목 등) 업데이트
          if (isDuplicate) {
            return {
              tabs: state.tabs.map((t) =>
                t.tripSlug === trip.tripSlug ? { ...t, ...trip } : t
              ),
              activeSlug: trip.tripSlug,
            }
          }

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

      clearTabs: () => set({ tabs: [], activeSlug: null }),
    }),
    {
      name: 'trak-tabs',
      version: 1,
      migrate: (persistedState) => {
        const state = persistedState as Partial<TabState>
        return {
          ...state,
          tabs: [],
          activeSlug: null,
          activeUserId: null,
        }
      },
    }
  )
)
