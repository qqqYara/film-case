import type { Movie } from "@/types/tmdb";

export type SortKey = "relevance" | "popularity" | "rating" | "release" | "title";

export const SORT_LABELS: Record<SortKey, string> = {
  relevance: "Relevance",
  popularity: "Popularity",
  rating: "Rating",
  release: "Release date",
  title: "Title (A–Z)",
};

/**
 * Sort already-fetched movies in the browser. Used where the API can't sort
 * for us (search, popular). `relevance` keeps the server's original order.
 */
export function sortMovies(movies: Movie[], key: SortKey): Movie[] {
  if (key === "relevance") return movies;
  const sorted = [...movies];
  switch (key) {
    case "popularity":
      sorted.sort((a, b) => b.popularity - a.popularity);
      break;
    case "rating":
      sorted.sort((a, b) => b.vote_average - a.vote_average);
      break;
    case "release":
      sorted.sort((a, b) =>
        (b.release_date ?? "").localeCompare(a.release_date ?? ""),
      );
      break;
    case "title":
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }
  return sorted;
}

/**
 * Map our sort keys to TMDb `/discover` `sort_by` values. Used by the genre
 * page, where TMDb sorts server-side across the whole result set.
 */
export const DISCOVER_SORT_BY: Record<Exclude<SortKey, "relevance">, string> = {
  popularity: "popularity.desc",
  rating: "vote_average.desc",
  release: "primary_release_date.desc",
  title: "original_title.asc",
};

export function discoverSortBy(key: string | null | undefined): string {
  if (key && key in DISCOVER_SORT_BY) {
    return DISCOVER_SORT_BY[key as Exclude<SortKey, "relevance">];
  }
  return DISCOVER_SORT_BY.popularity;
}
