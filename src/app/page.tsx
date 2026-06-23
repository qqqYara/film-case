import Image from "next/image";
import KineticHero from "@/components/KineticHero";
import MovieGrid from "@/components/MovieGrid";
import PopularMovies from "@/components/PopularMovies";
import { getPopularMovies, getTrendingMovies, tmdbImageUrl } from "@/lib/tmdb";

export default async function Home() {
  const [trending, popular] = await Promise.all([
    getTrendingMovies("week"),
    getPopularMovies(),
  ]);

  const featured = trending.results[0];
  const backdrop = featured
    ? tmdbImageUrl(featured.backdrop_path, "original")
    : null;

  return (
    <main className="flex flex-1 flex-col">
      <KineticHero />
      <div
        id="discover"
        className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-12"
      >
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Trending this week
          </h2>
          <MovieGrid movies={trending.results.slice(0, 6)} />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Popular right now
          </h2>
          <PopularMovies initialPage={popular} />
        </section>
      </div>
      {featured && (
        <section className="relative isolate overflow-hidden border-b border-black/5 dark:border-white/10">
          {backdrop && (
            <Image
              src={backdrop}
              alt=""
              fill
              priority
              sizes="100vw"
              className="-z-10 object-cover opacity-30"
            />
          )}
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-zinc-50 via-zinc-50/60 to-transparent dark:from-black dark:via-black/70" />
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-20 sm:py-28">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">
              #1 Trending this week
            </span>
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
              {featured.title}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-zinc-600 line-clamp-3 dark:text-zinc-300">
              {featured.overview}
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
