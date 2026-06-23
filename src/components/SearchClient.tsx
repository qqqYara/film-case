"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import LoadMoreButton from "@/components/LoadMoreButton";
import MovieGrid from "@/components/MovieGrid";
import MovieGridSkeleton from "@/components/MovieGridSkeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { useMounted } from "@/hooks/useMounted";
import { flattenUniqueById, getNextPageParam } from "@/lib/pagination";
import { type SortKey, sortMovies } from "@/lib/sort";
import SortSelect from "@/components/SortSelect";
import { searchMovies } from "@/lib/tmdb-client";
import { useRecentSearches } from "@/store/recent-searches";

const SORT_OPTIONS: SortKey[] = [
  "relevance",
  "popularity",
  "rating",
  "release",
  "title",
];

export default function SearchClient() {
  const [input, setInput] = useState("");
  const [sort, setSort] = useState<SortKey>("relevance");
  const debounced = useDebounce(input, 400);
  const trimmed = debounced.trim();

  const mounted = useMounted();
  const { searches, add, remove, clear } = useRecentSearches();
  // The server can't read localStorage, so treat recent searches as empty
  // until after hydration to keep server and client markup identical.
  const recent = mounted ? searches : [];

  const {
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: ["search", trimmed],
    queryFn: ({ pageParam }) => searchMovies(trimmed, pageParam),
    initialPageParam: 1,
    getNextPageParam,
    enabled: trimmed.length > 0,
  });

  function commit(term: string) {
    const cleaned = term.trim();
    if (cleaned) add(cleaned);
  }

  const results = sortMovies(flattenUniqueById(data?.pages), sort);
  const isInitialLoading = isFetching && !isFetchingNextPage;
  const showEmptyState =
    trimmed.length > 0 && !isFetching && results.length === 0;

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // Read straight from the form so we commit the value the user
          // actually submitted (not a stale closure of `input`).
          const value = new FormData(e.currentTarget).get("q");
          commit(typeof value === "string" ? value : input);
        }}
        className="flex flex-col gap-3"
      >
        <input
          type="search"
          name="q"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search for a movie…"
          autoFocus
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-base text-zinc-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 dark:border-white/15 dark:bg-zinc-900 dark:text-zinc-50"
        />

        {recent.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
              Recent
            </span>
            {recent.map((term) => (
              <span
                key={term}
                className="flex items-center gap-1 rounded-full bg-black/5 py-1 pl-3 pr-1 text-sm text-zinc-700 dark:bg-white/10 dark:text-zinc-200"
              >
                <button
                  type="button"
                  aria-label={`Search for ${term}`}
                  onClick={() => {
                    setInput(term);
                    commit(term);
                  }}
                  className="hover:text-amber-500"
                >
                  {term}
                </button>
                <button
                  type="button"
                  aria-label={`Remove ${term}`}
                  onClick={() => remove(term)}
                  className="flex h-5 w-5 items-center justify-center rounded-full text-zinc-400 hover:bg-black/10 hover:text-zinc-700 dark:hover:bg-white/10 dark:hover:text-zinc-200"
                >
                  ×
                </button>
              </span>
            ))}
            <button
              type="button"
              aria-label="Clear all recent searches"
              onClick={clear}
              className="text-xs text-zinc-400 underline hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              Clear all
            </button>
          </div>
        )}
      </form>

      {isError && (
        <p className="text-sm text-red-500">
          Something went wrong with the search. Please try again.
        </p>
      )}

      {isInitialLoading && <MovieGridSkeleton count={12} />}

      {showEmptyState && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No movies found for “{trimmed}”.
        </p>
      )}

      {trimmed.length === 0 && recent.length === 0 && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Start typing to search the catalogue.
        </p>
      )}

      {results.length > 0 && (
        <>
          <div className="flex justify-end">
            <SortSelect value={sort} onChange={setSort} options={SORT_OPTIONS} />
          </div>
          <MovieGrid movies={results} />
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
