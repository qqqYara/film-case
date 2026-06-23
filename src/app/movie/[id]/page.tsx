import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CastList from "@/components/CastList";
import ImageGallery from "@/components/ImageGallery";
import MovieGrid from "@/components/MovieGrid";
import TrailerPlayer from "@/components/TrailerPlayer";
import WatchlistButton from "@/components/WatchlistButton";
import { getMovieDetails, getPopularMovies, getTrendingMovies, tmdbImageUrl } from "@/lib/tmdb";
import type { MovieDetails, Video } from "@/types/tmdb";

export const dynamicParams = false;

export async function generateStaticParams() {
  const [popular, trending] = await Promise.all([
    getPopularMovies(1),
    getTrendingMovies("week"),
  ]);
  const ids = new Set([
    ...popular.results.map((movie) => movie.id),
    ...trending.results.map((movie) => movie.id),
  ]);
  return [...ids].map((id) => ({ id: String(id) }));
}

async function loadMovie(id: string): Promise<MovieDetails | null> {
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) return null;
  try {
    return await getMovieDetails(numericId);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const movie = await loadMovie(id);
  if (!movie) return { title: "Not found · Film Case" };
  return {
    title: `${movie.title} · Film Case`,
    description: movie.overview,
  };
}

function formatRuntime(minutes: number | null): string | null {
  if (!minutes) return null;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

/** Pick the best YouTube trailer, falling back to a teaser or any clip. */
function pickTrailer(videos?: Video[]): Video | undefined {
  if (!videos) return undefined;
  const youtube = videos.filter((v) => v.site === "YouTube");
  return (
    youtube.find((v) => v.type === "Trailer" && v.official) ??
    youtube.find((v) => v.type === "Trailer") ??
    youtube.find((v) => v.type === "Teaser") ??
    youtube[0]
  );
}

export default async function MovieDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = await loadMovie(id);
  if (!movie) notFound();

  const backdrop = tmdbImageUrl(movie.backdrop_path, "original");
  const poster = tmdbImageUrl(movie.poster_path, "w500");
  const year = movie.release_date?.slice(0, 4) || "—";
  const runtime = formatRuntime(movie.runtime);
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "NR";

  const directors =
    movie.credits?.crew.filter((person) => person.job === "Director") ?? [];
  const cast = movie.credits?.cast ?? [];
  const trailer = pickTrailer(movie.videos?.results);
  const backdrops = movie.images?.backdrops ?? [];
  const recommendations = movie.recommendations?.results ?? [];

  return (
    <main className="flex flex-1 flex-col">
      <section className="relative isolate overflow-hidden border-b border-black/5 dark:border-white/10">
        {backdrop && (
          <Image
            src={backdrop}
            alt=""
            fill
            priority
            sizes="100vw"
            className="-z-10 object-cover opacity-25"
          />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-zinc-50 via-zinc-50/70 to-transparent dark:from-black dark:via-black/80" />

        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:py-16">
          <div className="relative aspect-[2/3] w-40 shrink-0 overflow-hidden rounded-xl bg-zinc-200 shadow-lg sm:w-56 dark:bg-zinc-800">
            {poster ? (
              <Image
                src={poster}
                alt={`${movie.title} poster`}
                fill
                sizes="(max-width: 640px) 160px, 224px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center px-3 text-center text-sm text-zinc-500">
                {movie.title}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-base italic text-zinc-500 dark:text-zinc-400">
                  {movie.tagline}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300">
              <span className="rounded-full bg-black/70 px-2.5 py-1 font-semibold text-amber-300">
                ★ {rating}
              </span>
              <span>{year}</span>
              {runtime && <span>· {runtime}</span>}
              {movie.status && <span>· {movie.status}</span>}
            </div>

            {movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-white/15 dark:text-zinc-300"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {directors.length > 0 && (
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                <span className="text-zinc-400">Directed by</span>{" "}
                {directors.map((d) => d.name).join(", ")}
              </p>
            )}

            {movie.overview && (
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Overview
                </h2>
                <p className="max-w-2xl leading-7 text-zinc-700 dark:text-zinc-300">
                  {movie.overview}
                </p>
              </div>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <WatchlistButton
                movie={{
                  id: movie.id,
                  title: movie.title,
                  poster_path: movie.poster_path,
                  release_date: movie.release_date,
                  vote_average: movie.vote_average,
                }}
                variant="full"
              />
              <Link
                href="/"
                aria-label="Back to movies"
                className="w-fit rounded-full border border-black/10 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-black/5 dark:border-white/15 dark:text-zinc-200 dark:hover:bg-white/10"
              >
                ← Back to movies
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-12">
        {cast.length > 0 && <CastList cast={cast} />}

        {trailer && (
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Trailer
            </h2>
            <TrailerPlayer
              videoKey={trailer.key}
              title={movie.title}
              thumbnail={backdrop}
            />
          </section>
        )}

        {backdrops.length > 0 && <ImageGallery images={backdrops} />}

        {recommendations.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              More like this
            </h2>
            <MovieGrid movies={recommendations.slice(0, 6)} />
          </section>
        )}
      </div>
    </main>
  );
}
