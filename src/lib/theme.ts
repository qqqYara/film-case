export const THEME_STORAGE_KEY = "film-case:theme";

export type Theme = "dark" | "light";

/** Runs before paint so a saved light preference does not flash dark. */
export const themeInitScript = `(function(){try{if(localStorage.getItem("${THEME_STORAGE_KEY}")==="light"){document.documentElement.classList.remove("dark")}}catch(e){}})();`;
