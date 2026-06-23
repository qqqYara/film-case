"use client";

export default function LoadMoreButton({
  onClick,
  isFetching,
  hasNextPage,
}: {
  onClick: () => void;
  isFetching: boolean;
  hasNextPage: boolean;
}) {
  if (!hasNextPage) return null;

  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={onClick}
        disabled={isFetching}
        aria-label={isFetching ? "Loading more movies" : "Load more movies"}
        className="rounded-full border border-black/10 px-6 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/15 dark:text-zinc-200 dark:hover:bg-white/10"
      >
        {isFetching ? "Loading…" : "Load more"}
      </button>
    </div>
  );
}
