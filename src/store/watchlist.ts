import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MovieSummary } from "@/types/tmdb";

interface WatchlistState {
  items: MovieSummary[];
  toggle: (movie: MovieSummary) => void;
  remove: (id: number) => void;
  clear: () => void;
}

export const useWatchlist = create<WatchlistState>()(
  persist(
    (set) => ({
      items: [],
      toggle: (movie) =>
        set((state) => {
          const exists = state.items.some((m) => m.id === movie.id);
          return exists
            ? { items: state.items.filter((m) => m.id !== movie.id) }
            : { items: [movie, ...state.items] };
        }),
      remove: (id) =>
        set((state) => ({ items: state.items.filter((m) => m.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    { name: "film-case:watchlist" },
  ),
);

/**
 * Subscribe to whether a single movie is in the watchlist. Using a selector
 * means the component only re-renders when *this* movie's membership changes.
 */
export function useIsInWatchlist(id: number): boolean {
  return useWatchlist((state) => state.items.some((m) => m.id === id));
}
