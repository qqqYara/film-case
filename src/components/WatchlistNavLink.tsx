"use client";

import Link from "next/link";
import { useMounted } from "@/hooks/useMounted";
import { useWatchlist } from "@/store/watchlist";

export default function WatchlistNavLink() {
  const mounted = useMounted();
  const count = useWatchlist((state) => state.items.length);

  return (
    <Link
      href="/watchlist"
      aria-label={
        mounted && count > 0
          ? `Watchlist, ${count} ${count === 1 ? "movie" : "movies"}`
          : "Watchlist"
      }
      className="flex items-center gap-1.5 transition hover:text-amber-500"
    >
      Watchlist
      {mounted && count > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-xs font-semibold text-black">
          {count}
        </span>
      )}
    </Link>
  );
}
