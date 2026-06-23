"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Renders each character as an inline-block span so GSAP can animate them
 * individually. The spans are aria-hidden; the readable text is exposed via
 * the parent's aria-label so screen readers get the sentence, not letters.
 */
function SplitChars({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((char, i) => (
        <span
          key={`${char}-${i}`}
          aria-hidden="true"
          className="kh-char inline-block whitespace-pre will-change-transform"
        >
          {char}
        </span>
      ))}
    </>
  );
}

export default function KineticHero() {
  const container = useRef<HTMLElement>(null);

  function scrollToContent() {
    document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" });
  }

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduced: "(prefers-reduced-motion: reduce)",
          full: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          // Reduced-motion users keep the static, fully-visible layout.
          if (ctx.conditions?.reduced) return;

          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          tl.from(".kh-label", { y: 16, opacity: 0, duration: 0.6 })
            .from(
              ".kh-char",
              {
                yPercent: 120,
                opacity: 0,
                filter: "blur(12px)",
                rotateX: -45,
                transformOrigin: "50% 100%",
                stagger: 0.025,
                duration: 0.9,
              },
              "-=0.2",
            )
            .fromTo(
              ".kh-sweep",
              { xPercent: -180, opacity: 0, rotation: 14 },
              { xPercent: 340, opacity: 1, duration: 1.3, ease: "power2.inOut" },
              "-=0.8",
            )
            .set(".kh-sweep", { opacity: 0 })
            .from(".kh-sub", { y: 14, opacity: 0, duration: 0.6 }, "-=0.4")
            .from(".kh-cta", { y: 14, opacity: 0, duration: 0.6 }, "-=0.4")
            .from(".kh-scroll", { y: 10, opacity: 0, duration: 0.6 }, "-=0.3");

          gsap.to(".kh-scroll-arrow", {
            y: 6,
            repeat: -1,
            yoyo: true,
            duration: 1.2,
            ease: "power1.inOut",
            delay: 2.5,
          });

          // Ambient beam: glides fully across and off-screen, waits, then
          // returns from the other side at a different angle, waits, repeats.
          const beam = gsap.timeline({
            repeat: -1,
            repeatDelay: 4,
            delay: 3.5,
          });

          beam
            // Pass 1 — left to right, exits the screen completely.
            .set(".kh-sweep", { rotation: 16, xPercent: -180, opacity: 0 })
            .to(".kh-sweep", { opacity: 0.7, duration: 0.5 })
            .to(
              ".kh-sweep",
              { xPercent: 340, duration: 2.2, ease: "power1.inOut" },
              "<",
            )
            .to(".kh-sweep", { opacity: 0, duration: 0.5 }, ">-0.5")
            // Pause, then Pass 2 — right to left at a different angle.
            .to({}, { duration: 3 })
            .set(".kh-sweep", { rotation: -12, xPercent: 340, opacity: 0 })
            .to(".kh-sweep", { opacity: 0.7, duration: 0.5 })
            .to(
              ".kh-sweep",
              { xPercent: -180, duration: 2.2, ease: "power1.inOut" },
              "<",
            )
            .to(".kh-sweep", { opacity: 0, duration: 0.5 }, ">-0.5");
        },
      );
    },
    { scope: container },
  );

  return (
    <section
      ref={container}
      className="relative isolate flex min-h-[calc(100svh-61px)] items-center overflow-hidden border-b border-black/5 bg-zinc-50 dark:border-white/10 dark:bg-black"
    >
      {/* Soft amber glow pooling from the top. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(245,158,11,0.16),transparent_70%)]"
      />
      {/* Persistent diagonal light beam (the resting-state look). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-20 h-[180%] w-[55%] -translate-x-1/2 -translate-y-1/2 rotate-[24deg] bg-[linear-gradient(90deg,transparent,rgba(245,158,11,0.20),transparent)] blur-3xl"
      />
      {/* Animated sweep that streaks across on load and ambiently after. */}
      <div
        aria-hidden="true"
        className="kh-sweep pointer-events-none absolute -inset-y-24 left-0 -z-10 w-1/3 bg-gradient-to-r from-transparent via-amber-300/40 to-transparent opacity-0 blur-2xl"
      />

      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-7 px-6 py-20 text-center">
        <span className="kh-label text-xs font-semibold uppercase tracking-[0.4em] text-amber-500">
          Film<span className="text-amber-400">Case</span>
        </span>

        <h1
          aria-label="Every film has a story."
          style={{ perspective: 800 }}
          className="w-full text-5xl font-bold leading-[1.05] tracking-tight text-zinc-900 drop-shadow-sm sm:text-7xl dark:text-zinc-50"
        >
          <span className="block">
            <SplitChars text="Every film" />
          </span>
          <span className="block">
            <SplitChars text="has a " />
            <span className="text-amber-500">
              <SplitChars text="story." />
            </span>
          </span>
        </h1>

        <p className="kh-sub mx-auto w-full max-w-[28rem] text-lg text-zinc-600 dark:text-zinc-300">
          Find films that move you.
        </p>

        <Link
          href="/search"
          aria-label="Explore films"
          className="kh-cta inline-flex items-center gap-2 rounded-full border border-amber-500/60 px-6 py-3 text-sm font-semibold text-amber-600 transition hover:bg-amber-500 hover:text-white dark:text-amber-400 dark:hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
          Explore films
        </Link>
      </div>

      <button
        type="button"
        onClick={scrollToContent}
        aria-label="Scroll to discover films"
        className="kh-scroll absolute cursor-pointer bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-zinc-400 transition-colors hover:text-amber-500 dark:text-zinc-500 dark:hover:text-amber-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-7 w-5"
          aria-hidden="true"
        >
          <rect x="6.5" y="2.5" width="11" height="18" rx="5.5" />
          <line
            x1="12"
            y1="6.5"
            x2="12"
            y2="10.5"
            strokeLinecap="round"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="kh-scroll-arrow h-4 w-4"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </section>
  );
}
