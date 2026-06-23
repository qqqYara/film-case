"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadMoreButton from "@/components/LoadMoreButton";
import MovieGrid from "@/components/MovieGrid";
import MovieGridSkeleton from "@/components/MovieGridSkeleton";
import { flattenUniqueById, getNextPageParam } from "@/lib/pagination";
import type { SortKey } from "@/lib/sort";
import SortSelect from "@/components/SortSelect";
import type { Genre, Movie, PaginatedResponse } from "@/types/tmdb";

const SORT_OPTIONS: SortKey[] = ["popularity", "rating", "release", "title"];

async function fetchDiscover(
  genreId: number,
  page: number,
  sort: SortKey,
): Promise<PaginatedResponse<Movie>> {
  const res = await fetch(
    `/api/discover?genre=${genreId}&sort=${sort}&page=${page}`,
  );
  if (!res.ok) throw new Error("Failed to load movies for this genre");
  return res.json();
}

export default function GenreBrowser({
  genres,
  initialGenreId,
  initialSort,
}: {
  genres: Genre[];
  initialGenreId: number | null;
  initialSort: SortKey;
}) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<number | null>(initialGenreId);
  const [sort, setSort] = useState<SortKey>(initialSort);

  // Keep the URL in sync so the genre + sort are shareable and survive refresh.
  function syncUrl(genreId: number | null, sortKey: SortKey) {
    if (genreId === null) {
      router.replace("/genres", { scroll: false });
      return;
    }
    router.replace(`/genres?genre=${genreId}&sort=${sortKey}`, {
      scroll: false,
    });
  }

  function selectGenre(id: number) {
    const next = id === selectedId ? null : id;
    setSelectedId(next);
    syncUrl(next, sort);
  }

  function changeSort(next: SortKey) {
    setSort(next);
    syncUrl(selectedId, next);
  }

  const {
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: ["discover", selectedId, sort],
    queryFn: ({ pageParam }) =>
      fetchDiscover(selectedId as number, pageParam, sort),
    initialPageParam: 1,
    getNextPageParam,
    enabled: selectedId !== null,
  });

  const movies = flattenUniqueById(data?.pages);
  const isInitialLoading = isFetching && !isFetchingNextPage;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => {
          const active = genre.id === selectedId;
          return (
            <button
              key={genre.id}
              type="button"
              onClick={() => selectGenre(genre.id)}
              aria-pressed={active}
              aria-label={`${active ? "Deselect" : "Select"} ${genre.name} genre`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                active
                  ? "bg-amber-500 text-black"
                  : "border border-black/10 text-zinc-700 hover:bg-black/5 dark:border-white/15 dark:text-zinc-200 dark:hover:bg-white/10"
              }`}
            >
              {genre.name}
            </button>
          );
        })}
      </div>

      {selectedId === null ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Pick a genre to explore movies.
        </p>
      ) : (
        <div className="flex justify-end">
          <SortSelect value={sort} onChange={changeSort} options={SORT_OPTIONS} />
        </div>
      )}

      {isError && (
        <p className="text-sm text-red-500">
          Couldn’t load movies for this genre. Please try again.
        </p>
      )}

      {isInitialLoading && <MovieGridSkeleton count={12} />}

      {movies.length > 0 && (
        <>
          <MovieGrid movies={movies} />
          <LoadMoreButton
            onClick={() => fetchNextPage()}
            isFetching={isFetchingNextPage}
            hasNextPage={hasNextPage}
          />
        </>
      )}
    </div>
  );
}
