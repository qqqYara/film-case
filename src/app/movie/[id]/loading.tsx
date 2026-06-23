export default function MovieDetailsLoading() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="border-b border-black/5 dark:border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:py-16">
          <div className="aspect-[2/3] w-40 shrink-0 animate-pulse rounded-xl bg-zinc-200 sm:w-56 dark:bg-zinc-800" />

          <div className="flex w-full flex-col gap-4">
            <div className="h-9 w-2/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex gap-3">
              <div className="h-7 w-16 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-7 w-20 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-7 w-24 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-1/2 max-w-2xl animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
