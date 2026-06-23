"use client";

import { SORT_LABELS, type SortKey } from "@/lib/sort";

export default function SortSelect({
  value,
  onChange,
  options,
}: {
  value: SortKey;
  onChange: (value: SortKey) => void;
  options: SortKey[];
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
      Sort by
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 outline-none transition focus:border-amber-500 dark:border-white/15 dark:bg-zinc-900 dark:text-zinc-200"
      >
        {options.map((key) => (
          <option key={key} value={key}>
            {SORT_LABELS[key]}
          </option>
        ))}
      </select>
    </label>
  );
}
