import { discoverSortBy } from "@/lib/sort";
import type { Movie, PaginatedResponse } from "@/types/tmdb";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

async function tmdbClientFetch<T>(
  path: string,
  searchParams: Record<string, string | number | undefined> = {},
): Promise<T> {
  const token = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
  if (!token) {
    throw new Error(
      "Missing NEXT_PUBLIC_TMDB_ACCESS_TOKEN. Add it to your environment (see .env.example).",
    );
  }

  const url = new URL(`${TMDB_BASE_URL}${path}`);
  for (const [key, value] of Object.entries(searchParams)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`TMDb request failed (${res.status}): ${url.pathname}`);
  }

  return res.json() as Promise<T>;
}

export function getPopularMovies(page = 1) {
  return tmdbClientFetch<PaginatedResponse<Movie>>("/movie/popular", { page });
}

export function searchMovies(query: string, page = 1) {
  return tmdbClientFetch<PaginatedResponse<Movie>>("/search/movie", {
    query,
    page,
    include_adult: "false",
  });
}

export function discoverMoviesByGenre(
  genreId: number,
  page = 1,
  sortBy = "popularity.desc",
) {
  return tmdbClientFetch<PaginatedResponse<Movie>>("/discover/movie", {
    with_genres: genreId,
    page,
    sort_by: sortBy,
    include_adult: "false",
    "vote_count.gte": sortBy.startsWith("vote_average") ? 200 : undefined,
  });
}

export function discoverMoviesByGenreSort(
  genreId: number,
  page: number,
  sort: string,
) {
  return discoverMoviesByGenre(genreId, page, discoverSortBy(sort));
}
