import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_RECENT = 6;

interface RecentSearchesState {
  searches: string[];
  add: (term: string) => void;
  remove: (term: string) => void;
  clear: () => void;
}

export const useRecentSearches = create<RecentSearchesState>()(
  persist(
    (set) => ({
      searches: [],
      add: (term) =>
        set((state) => {
          const cleaned = term.trim();
          if (!cleaned) return state;
          // De-dupe (case-insensitive), newest first, capped to MAX_RECENT.
          const withoutDupe = state.searches.filter(
            (s) => s.toLowerCase() !== cleaned.toLowerCase(),
          );
          return { searches: [cleaned, ...withoutDupe].slice(0, MAX_RECENT) };
        }),
      remove: (term) =>
        set((state) => ({
          searches: state.searches.filter((s) => s !== term),
        })),
      clear: () => set({ searches: [] }),
    }),
    { name: "film-case:recent-searches" },
  ),
);
