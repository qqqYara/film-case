import Image from "next/image";
import Link from "next/link";
import WatchlistButton from "@/components/WatchlistButton";
import { tmdbImageUrl } from "@/lib/tmdb";
import type { MovieSummary } from "@/types/tmdb";

export default function MovieCard({ movie }: { movie: MovieSummary }) {
  const poster = tmdbImageUrl(movie.poster_path, "w500");
  const year = movie.release_date?.slice(0, 4) || "—";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "NR";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-zinc-900">
      {/* Heart sits outside the Link so it doesn't nest a button in an anchor. */}
      <div className="absolute right-2 top-2 z-10">
        <WatchlistButton movie={movie} variant="icon" />
      </div>

      <Link
        href={`/movie/${movie.id}`}
        aria-label={`View ${movie.title}`}
        className="flex flex-col"
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
          {poster ? (
            <Image
              src={poster}
              alt={`${movie.title} poster`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-3 text-center text-sm text-zinc-500">
              {movie.title}
            </div>
          )}
          <span className="absolute bottom-2 left-2 rounded-full bg-black/70 px-2 py-0.5 text-xs font-semibold text-amber-300 backdrop-blur">
            ★ {rating}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 p-3">
          <h3 className="line-clamp-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {movie.title}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{year}</p>
        </div>
      </Link>
    </div>
  );
}
