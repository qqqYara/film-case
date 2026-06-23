import Link from "next/link";
import WatchlistNavLink from "@/components/WatchlistNavLink";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-black/5 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-black/70">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Film<span className="text-amber-500">Case</span>
          </span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-300">
          <Link href="/" className="transition hover:text-amber-500">
            Home
          </Link>
          <Link href="/search" className="transition hover:text-amber-500">
            Search
          </Link>
          <Link href="/genres" className="transition hover:text-amber-500">
            Genres
          </Link>
          <WatchlistNavLink />
          <Link href="/about" className="transition hover:text-amber-500">
            About
          </Link>
        </div>
      </nav>
    </header>
  );
}
