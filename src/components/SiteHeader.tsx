"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import WatchlistNavLink from "@/components/WatchlistNavLink";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
  { href: "/genres", label: "Genres" },
] as const;

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setOpen(false);

  // Lock body scroll while the full-screen menu is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-30 border-b backdrop-blur transition-colors ${
        open
          ? "border-transparent bg-white dark:bg-zinc-950"
          : "border-black/5 bg-white/80 dark:border-white/10 dark:bg-black/70"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          aria-label="FilmCase home"
          className="flex items-center gap-2"
          onClick={closeMenu}
        >
          <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Film<span className="text-amber-500">Case</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 text-sm font-medium text-zinc-600 lg:flex dark:text-zinc-300">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-label={link.label}
              className="transition hover:text-amber-500"
            >
              {link.label}
            </Link>
          ))}
          <WatchlistNavLink />
          <Link href="/about" aria-label="About" className="transition hover:text-amber-500">
            About
          </Link>
        </div>

        {/* Mobile / tablet toggle */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="relative z-30 flex h-10 w-10 items-center justify-center rounded-md text-zinc-600 transition hover:bg-black/5 hover:text-amber-500 lg:hidden dark:text-zinc-300 dark:hover:bg-white/10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
            aria-hidden="true"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Full-screen mobile / tablet menu */}
      {open && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-0 z-20 flex h-[100vh] flex-col items-center justify-center gap-8 bg-white/95 text-2xl font-semibold text-zinc-700 backdrop-blur-md lg:hidden dark:bg-zinc-950/95 dark:text-zinc-200"
        >
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-label={link.label}
                onClick={closeMenu}
                className={`transition hover:text-amber-500 ${
                  active ? "text-amber-500" : ""
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div onClick={closeMenu} className="transition hover:text-amber-500">
            <WatchlistNavLink />
          </div>
          <Link
            href="/about"
            aria-label="About"
            onClick={closeMenu}
            className={`transition hover:text-amber-500 ${
              pathname === "/about" ? "text-amber-500" : ""
            }`}
          >
            About
          </Link>
        </div>
      )}
    </header>
  );
}
