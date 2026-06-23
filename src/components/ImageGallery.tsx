"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { tmdbImageUrl } from "@/lib/tmdb";
import type { MovieImage } from "@/types/tmdb";

export default function ImageGallery({ images }: { images: MovieImage[] }) {
  const backdrops = images.slice(0, 9);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const showPrev = useCallback(
    () =>
      setActiveIndex((i) =>
        i === null ? i : (i - 1 + backdrops.length) % backdrops.length,
      ),
    [backdrops.length],
  );
  const showNext = useCallback(
    () => setActiveIndex((i) => (i === null ? i : (i + 1) % backdrops.length)),
    [backdrops.length],
  );

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeIndex, close, showPrev, showNext]);

  if (backdrops.length === 0) return null;

  const activeImage =
    activeIndex !== null ? backdrops[activeIndex] : null;
  const activeFull = activeImage
    ? tmdbImageUrl(activeImage.file_path, "original")
    : null;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Gallery
      </h2>
      <ul className="flex gap-4 overflow-x-auto pb-2">
        {backdrops.map((image, index) => {
          const thumb = tmdbImageUrl(image.file_path, "w780");
          if (!thumb) return null;
          return (
            <li key={image.file_path} className="shrink-0">
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`View image ${index + 1} of ${backdrops.length}`}
                className="block overflow-hidden rounded-lg"
              >
                <Image
                  src={thumb}
                  alt=""
                  width={320}
                  height={180}
                  className="h-44 w-auto object-cover transition hover:opacity-90"
                />
              </button>
            </li>
          );
        })}
      </ul>

      {activeFull && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery viewer"
          onClick={close}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
          >
            &times;
          </button>

          {backdrops.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-3xl text-white transition hover:bg-white/20"
              >
                &#8249;
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                aria-label="Next image"
                className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-3xl text-white transition hover:bg-white/20"
              >
                &#8250;
              </button>
            </>
          )}

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-full max-w-5xl"
          >
            <Image
              src={activeFull}
              alt=""
              width={1280}
              height={720}
              sizes="100vw"
              className="h-auto max-h-[85vh] w-auto rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
