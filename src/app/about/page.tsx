import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About · Film Case",
  description: "What Film Case is and the tech behind it.",
};

const stack = [
  { name: "Next.js", detail: "App Router, Server Components" },
  { name: "TypeScript", detail: "End-to-end type safety" },
  { name: "Tailwind CSS", detail: "Utility-first styling" },
  { name: "TanStack Query", detail: "Async data & caching" },
  { name: "Zustand", detail: "Lightweight client state" },
  { name: "GSAP", detail: "Animated hero & motion" },
  { name: "TMDb API", detail: "Movie data source" },
];

export default function AboutPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          About Film Case
        </h1>
        <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-300">
          Film Case is a movie discovery app built as a learning project. Browse
          trending and popular films, search the catalogue, and dig into details
          — all powered by{" "}
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="The Movie Database (opens in new tab)"
            className="font-medium text-amber-600 hover:underline dark:text-amber-400"
          >
            The Movie Database (TMDb)
          </a>
          .
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Built with
        </h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {stack.map((item) => (
            <li
              key={item.name}
              className="rounded-xl border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-zinc-900"
            >
              <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                {item.name}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {item.detail}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        This product uses the TMDb API but is not endorsed or certified by TMDb.
      </p>

      <Link
        href="/"
        aria-label="Back to movies"
        className="w-fit rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        ← Back to movies
      </Link>
    </main>
  );
}
