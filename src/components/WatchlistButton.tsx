"use client";

import { useMounted } from "@/hooks/useMounted";
import { useIsInWatchlist, useWatchlist } from "@/store/watchlist";
import type { MovieSummary } from "@/types/tmdb";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s-6.7-4.35-9.33-7.5C.9 11.27 1.2 8.1 3.4 6.6a4.5 4.5 0 0 1 6 .9L12 9.6l2.6-2.1a4.5 4.5 0 0 1 6-.9c2.2 1.5 2.5 4.67.73 6.9C18.7 16.65 12 21 12 21Z"
      />
    </svg>
  );
}

export default function WatchlistButton({
  movie,
  variant = "icon",
}: {
  movie: MovieSummary;
  variant?: "icon" | "full";
}) {
  const mounted = useMounted();
  const inWatchlist = useIsInWatchlist(movie.id);
  const toggle = useWatchlist((state) => state.toggle);

  // Before hydration we don't know the persisted state, so show the neutral
  // "not added" look to keep server and client markup identical.
  const active = mounted && inWatchlist;

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={() => toggle(movie)}
        aria-pressed={active}
        aria-label={active ? "Remove from watchlist" : "Add to watchlist"}
        className={`flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition ${
          active
            ? "bg-amber-500 text-black hover:bg-amber-400"
            : "border border-black/10 text-zinc-700 hover:bg-black/5 dark:border-white/15 dark:text-zinc-200 dark:hover:bg-white/10"
        }`}
      >
        <HeartIcon filled={active} />
        {active ? "In your watchlist" : "Add to watchlist"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggle(movie)}
      aria-pressed={active}
      aria-label={active ? "Remove from watchlist" : "Add to watchlist"}
      className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur transition ${
        active
          ? "bg-amber-500 text-black"
          : "bg-black/60 text-white hover:bg-black/80"
      }`}
    >
      <HeartIcon filled={active} />
    </button>
  );
}
