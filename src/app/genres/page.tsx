import type { Metadata } from "next";
import GenreBrowser from "@/components/GenreBrowser";
import { SORT_LABELS, type SortKey } from "@/lib/sort";
import { getGenres } from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "Genres · Film Case",
  description: "Browse movies by genre.",
};

export default async function GenresPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string; sort?: string }>;
}) {
  const [{ genres }, { genre, sort }] = await Promise.all([
    getGenres(),
    searchParams,
  ]);

  const initialGenreId = genre && Number(genre) ? Number(genre) : null;
  const initialSort: SortKey =
    sort && sort !== "relevance" && sort in SORT_LABELS
      ? (sort as SortKey)
      : "popularity";

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Browse by genre
      </h1>
      <GenreBrowser
        genres={genres}
        initialGenreId={initialGenreId}
        initialSort={initialSort}
      />
    </main>
  );
}
