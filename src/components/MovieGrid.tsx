import MovieCard from "./MovieCard";
import type { MovieSummary } from "@/types/tmdb";

export default function MovieGrid({ movies }: { movies: MovieSummary[] }) {
  if (movies.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        No movies to show.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
