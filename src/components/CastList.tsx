import Image from "next/image";
import { tmdbImageUrl } from "@/lib/tmdb";
import type { CastMember } from "@/types/tmdb";

export default function CastList({ cast }: { cast: CastMember[] }) {
  const top = cast.slice(0, 12);
  if (top.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Top cast
      </h2>
      <ul className="flex gap-4 overflow-x-auto pb-2">
        {top.map((person) => {
          const photo = tmdbImageUrl(person.profile_path, "w185");
          return (
            <li
              key={`${person.id}-${person.order}`}
              className="w-28 shrink-0"
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-800">
                {photo ? (
                  <Image
                    src={photo}
                    alt={person.name}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-2 text-center text-xs text-zinc-500">
                    {person.name}
                  </div>
                )}
              </div>
              <p className="mt-2 line-clamp-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {person.name}
              </p>
              <p className="line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">
                {person.character}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
