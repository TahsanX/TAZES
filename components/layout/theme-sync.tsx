"use client";

import { useEffect } from "react";

/**
 * Re-applies the saved theme after hydration.
 *
 * The inline script in the root layout handles this before first paint on every
 * normal page. It cannot cover one case: notFound() raised from a route segment
 * makes Next render the document as <html id="__next_error__">, which supplies
 * its own html and head, so the root layout's script never ships — and React 19
 * hoists any replacement inline script into that same dropped head.
 *
 * This runs from the layout body instead, where nothing is dropped. On normal
 * pages it is a no-op re-assert; on those 404s it is what stops an explicitly
 * chosen theme from silently reverting to the system palette.
 */
export function ThemeSync() {
  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved !== "dark" && saved !== "light") return;
      if (document.documentElement.dataset.theme !== saved) {
        document.documentElement.dataset.theme = saved;
      }
    } catch {
      // Private mode or blocked site data — fall back to the system palette.
    }
  }, []);

  return null;
}
