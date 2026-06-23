function MovieCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-black/5 bg-white dark:border-white/10 dark:bg-zinc-900">
      <div className="aspect-[2/3] w-full animate-pulse bg-zinc-200 dark:bg-zinc-800" />
      <div className="flex flex-col gap-2 p-3">
        <div className="h-3.5 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}

export default function MovieGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
}
