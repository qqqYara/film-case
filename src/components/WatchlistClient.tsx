"use client";

import Link from "next/link";
import MovieGrid from "@/components/MovieGrid";
import { useMounted } from "@/hooks/useMounted";
import { useWatchlist } from "@/store/watchlist";

export default function WatchlistClient() {
  const mounted = useMounted();
  const items = useWatchlist((state) => state.items);
  const clear = useWatchlist((state) => state.clear);

  // Avoid a hydration mismatch: the server can't read localStorage.
  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-black/10 p-8 dark:border-white/15">
        <p className="text-zinc-600 dark:text-zinc-300">
          Your watchlist is empty.
        </p>
        <Link
          href="/"
          aria-label="Browse movies"
          className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Browse movies
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {items.length} {items.length === 1 ? "movie" : "movies"} saved
        </p>
        <button
          type="button"
          aria-label="Clear watchlist"
          onClick={clear}
          className="text-sm text-zinc-400 underline hover:text-zinc-600 dark:hover:text-zinc-300"
        >
          Clear all
        </button>
      </div>
      <MovieGrid movies={items} />
    </div>
  );
}
