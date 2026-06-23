import MovieGridSkeleton from "@/components/MovieGridSkeleton";

export default function HomeLoading() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="border-b border-black/5 dark:border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-20 sm:py-28">
          <div className="h-3 w-40 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-10 w-2/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-1/2 max-w-2xl animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-12">
        <section className="flex flex-col gap-4">
          <div className="h-6 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <MovieGridSkeleton count={12} />
        </section>
        <section className="flex flex-col gap-4">
          <div className="h-6 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <MovieGridSkeleton count={12} />
        </section>
      </div>
    </main>
  );
}
