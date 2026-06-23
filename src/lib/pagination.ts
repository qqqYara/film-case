import type { PaginatedResponse } from "@/types/tmdb";

/**
 * Given the last fetched page, return the next page number — or `undefined`
 * when there are no more pages. TanStack Query stops fetching on `undefined`.
 */
export function getNextPageParam(
  lastPage: PaginatedResponse<unknown>,
): number | undefined {
  return lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined;
}

/**
 * Flatten all loaded pages into a single list, removing duplicate ids.
 * TMDb occasionally repeats an item across pages, which would otherwise
 * trigger React "duplicate key" warnings.
 */
export function flattenUniqueById<T extends { id: number }>(
  pages: PaginatedResponse<T>[] | undefined,
): T[] {
  if (!pages) return [];
  const seen = new Set<number>();
  const result: T[] = [];
  for (const page of pages) {
    for (const item of page.results) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        result.push(item);
      }
    }
  }
  return result;
}
