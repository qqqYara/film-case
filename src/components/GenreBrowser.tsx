"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadMoreButton from "@/components/LoadMoreButton";
import MovieGrid from "@/components/MovieGrid";
import MovieGridSkeleton from "@/components/MovieGridSkeleton";
import { flattenUniqueById, getNextPageParam } from "@/lib/pagination";
import { SORT_LABELS, type SortKey } from "@/lib/sort";
import { discoverMoviesByGenreSort } from "@/lib/tmdb-client";
import SortSelect from "@/components/SortSelect";
import type { Genre } from "@/types/tmdb";

const SORT_OPTIONS: SortKey[] = ["popularity", "rating", "release", "title"];

function readGenreFromUrl(): number | null {
  const genre = new URLSearchParams(window.location.search).get("genre");
  const id = genre ? Number(genre) : NaN;
  return Number.isInteger(id) && id > 0 ? id : null;
}

function readSortFromUrl(): SortKey {
  const sort = new URLSearchParams(window.location.search).get("sort");
  if (sort && sort !== "relevance" && sort in SORT_LABELS) {
    return sort as SortKey;
  }
  return "popularity";
}

export default function GenreBrowser({ genres }: { genres: Genre[] }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [sort, setSort] = useState<SortKey>("popularity");

  // Static export can't read searchParams on the server, so hydrate from the URL.
  useEffect(() => {
    setSelectedId(readGenreFromUrl());
    setSort(readSortFromUrl());
  }, []);

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
      discoverMoviesByGenreSort(selectedId as number, pageParam, sort),
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
