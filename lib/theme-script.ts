/**
 * Applies the viewer's saved theme before the first paint.
 *
 * Must be inline and blocking — anything async lets the default palette render
 * first and flashes the wrong colour on a device set to the opposite scheme.
 *
 * It is injected in two places on purpose. notFound() raised from a route
 * segment makes Next render the document as <html id="__next_error__">, which
 * bypasses the root layout completely — head and body alike — so a copy also
 * lives in app/not-found.tsx. Without it, those pages ignore an explicit theme
 * choice and fall back to the system palette.
 */
export const NO_FLASH_SCRIPT = `try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light"){document.documentElement.dataset.theme=t}}catch(e){}`;
