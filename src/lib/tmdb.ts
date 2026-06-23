import type {
  GenreListResponse,
  Movie,
  MovieDetails,
  PaginatedResponse,
} from "@/types/tmdb";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

/**
 * Low-level TMDb fetch helper.
 *
 * This must only run on the server because it uses the secret access token.
 * Calling it from a client component would leak the token, so we guard against
 * accidental misuse.
 */
async function tmdbFetch<T>(
  path: string,
  searchParams: Record<string, string | number | undefined> = {},
): Promise<T> {
  const token = process.env.TMDB_ACCESS_TOKEN;
  if (!token) {
    throw new Error(
      "Missing TMDB_ACCESS_TOKEN. Add it to .env.local (see .env.example).",
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
    // Cache responses for an hour by default; tune per call as needed.
    next: { revalidate: 60 * 60 },
  });

  if (!res.ok) {
    throw new Error(`TMDb request failed (${res.status}): ${url.pathname}`);
  }

  return res.json() as Promise<T>;
}

export function getPopularMovies(page = 1) {
  return tmdbFetch<PaginatedResponse<Movie>>("/movie/popular", { page });
}

export function getTrendingMovies(timeWindow: "day" | "week" = "week") {
  return tmdbFetch<PaginatedResponse<Movie>>(`/trending/movie/${timeWindow}`);
}

export function searchMovies(query: string, page = 1) {
  return tmdbFetch<PaginatedResponse<Movie>>("/search/movie", {
    query,
    page,
    include_adult: "false",
  });
}

export function getMovieDetails(id: number) {
  return tmdbFetch<MovieDetails>(`/movie/${id}`, {
    // Fetch related data in a single request instead of many round-trips.
    append_to_response: "credits,videos,recommendations,images",
    include_image_language: "en,null",
  });
}

export function getGenres() {
  return tmdbFetch<GenreListResponse>("/genre/movie/list");
}

export function discoverMoviesByGenre(
  genreId: number,
  page = 1,
  sortBy = "popularity.desc",
) {
  return tmdbFetch<PaginatedResponse<Movie>>("/discover/movie", {
    with_genres: genreId,
    page,
    sort_by: sortBy,
    include_adult: "false",
    // Sorting by rating otherwise surfaces obscure films with a single
    // 10/10 vote, so require a meaningful number of votes for that sort.
    "vote_count.gte": sortBy.startsWith("vote_average") ? 200 : undefined,
  });
}

/** Build a full TMDb image URL. Returns null when there is no image. */
export function tmdbImageUrl(
  path: string | null,
  size:
    | "w92"
    | "w154"
    | "w185"
    | "w300"
    | "w342"
    | "w500"
    | "w780"
    | "w1280"
    | "original" = "w500",
): string | null {
  if (!path) return null;
  const base =
    process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL ??
    "https://image.tmdb.org/t/p";
  return `${base}/${size}${path}`;
}
