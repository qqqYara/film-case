"use client";

import Image from "next/image";
import { useState } from "react";

export default function TrailerPlayer({
  videoKey,
  title,
  thumbnail,
}: {
  videoKey: string;
  title: string;
  thumbnail: string | null;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
          title={`${title} trailer`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play ${title} trailer`}
      className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-zinc-900"
    >
      {thumbnail && (
        <Image
          src={thumbnail}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-cover opacity-70 transition group-hover:opacity-50"
        />
      )}
      <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 text-black shadow-lg transition group-hover:scale-110">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="ml-1 h-7 w-7"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </button>
  );
}
