export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  original_language: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface GenreListResponse {
  genres: Genre[];
}

/**
 * The minimal shape needed to render a movie card. Both `Movie` and
 * `MovieDetails` are assignable to it, so we can show cards from any source
 * (listings, search, watchlist) without refetching full details.
 */
export type MovieSummary = Pick<
  Movie,
  "id" | "title" | "poster_path" | "release_date" | "vote_average"
>;

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface MovieImage {
  file_path: string;
  width: number;
  height: number;
  aspect_ratio: number;
}

export interface MovieImages {
  backdrops: MovieImage[];
  posters: MovieImage[];
  logos: MovieImage[];
}

export interface MovieDetails extends Omit<Movie, "genre_ids"> {
  genres: Genre[];
  runtime: number | null;
  tagline: string | null;
  status: string;
  homepage: string | null;
  budget: number;
  revenue: number;
  // Present when requested via `append_to_response`.
  credits?: Credits;
  videos?: { results: Video[] };
  recommendations?: PaginatedResponse<Movie>;
  images?: MovieImages;
}
