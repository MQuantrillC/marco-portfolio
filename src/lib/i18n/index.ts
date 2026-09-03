import type { Dictionary, Locale } from "./config";

// Lazy imports, so a build only pays for the locale it is rendering and no
// dictionary reaches the client bundle wholesale. Only layout.tsx and page.tsx
// call this, and they hand each client component the slice it needs.
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./en").then((m) => m.default),
  es: () => import("./es").then((m) => m.default),
};

export const getDictionary = (locale: Locale) => dictionaries[locale]();
