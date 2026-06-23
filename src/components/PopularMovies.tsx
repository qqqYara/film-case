"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import LoadMoreButton from "@/components/LoadMoreButton";
import MovieGrid from "@/components/MovieGrid";
import SortSelect from "@/components/SortSelect";
import { flattenUniqueById, getNextPageParam } from "@/lib/pagination";
import { type SortKey, sortMovies } from "@/lib/sort";
import type { Movie, PaginatedResponse } from "@/types/tmdb";

const SORT_OPTIONS: SortKey[] = ["popularity", "rating", "release", "title"];

async function fetchPopular(page: number): Promise<PaginatedResponse<Movie>> {
  const res = await fetch(`/api/movies/popular?page=${page}`);
  if (!res.ok) throw new Error("Failed to load popular movies");
  return res.json();
}

export default function PopularMovies({
  initialPage,
}: {
  initialPage: PaginatedResponse<Movie>;
}) {
  const [sort, setSort] = useState<SortKey>("popularity");
  const [visibleCount, setVisibleCount] = useState(12);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["popular"],
      queryFn: ({ pageParam }) => fetchPopular(pageParam),
      initialPageParam: 1,
      getNextPageParam,
      // Seed with the page the server already fetched — no refetch on mount.
      initialData: { pages: [initialPage], pageParams: [1] },
    });

  const movies = sortMovies(flattenUniqueById(data?.pages), sort);
  const visibleMovies = movies.slice(0, visibleCount);
  const hasHiddenLoadedMovies = movies.length > visibleCount;
  const canLoadMore = hasHiddenLoadedMovies || Boolean(hasNextPage);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 12);
    if (!hasHiddenLoadedMovies && hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <>
      <div className="flex justify-end">
        <SortSelect value={sort} onChange={setSort} options={SORT_OPTIONS} />
      </div>
      <MovieGrid movies={visibleMovies} />
      <LoadMoreButton
        onClick={handleLoadMore}
        isFetching={isFetchingNextPage}
        hasNextPage={canLoadMore}
      />
    </>
  );
}
