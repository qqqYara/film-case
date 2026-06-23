import { useEffect, useState } from "react";

/**
 * Returns false on the server and the first client render, then true.
 *
 * Useful for UI that depends on persisted (localStorage) state: the server
 * can't know that state, so rendering it immediately would cause a hydration
 * mismatch. Gate such UI behind this flag.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
