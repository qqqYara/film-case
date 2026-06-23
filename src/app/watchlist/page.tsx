import type { Metadata } from "next";
import WatchlistClient from "@/components/WatchlistClient";

export const metadata: Metadata = {
  title: "Watchlist · Film Case",
  description: "Movies you've saved to watch later.",
};

export default function WatchlistPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Your watchlist
      </h1>
      <WatchlistClient />
    </main>
  );
}
