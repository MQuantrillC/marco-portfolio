// Locale plumbing. Safe to import from anywhere, client components included:
// it holds no dictionary data, only the shape of one.

export const locales = ["en", "es"] as const;

export type Locale = (typeof locales)[number];

// English stays the default so every link already in the wild, including the
// portfolio URL in the outreach emails, keeps resolving to a real page.
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const otherLocale = (locale: Locale): Locale => (locale === "en" ? "es" : "en");

// BCP 47 for <html lang>. Peru rather than Spain, since that is where the
// readers are. English is left unqualified, as it was before.
export const htmlLang: Record<Locale, string> = { en: "en", es: "es-PE" };

export const ogLocale: Record<Locale, string> = { en: "en_US", es: "es_PE" };

// Every string on the page that is not a proper noun. Anything absent from
// here is either a name, a product, or a number, and reads the same in both.
export type Dictionary = {
  role: string;
  skipToWork: string;
  // The link to the other language. Label and title are written in the target
  // language on purpose: they address someone who cannot read this page.
  switch: { label: string; title: string };
  hero: { lead: string };
  flag: {
    hintTitle: string;
    hintBody: string;
    dialogTitle: string;
    close: string;
    alt: string;
  };
  projects: {
    heading: string;
    open: string;
    source: string;
    // {title} is substituted with the project name.
    openIn: string;
    screenshot: string;
    // Keyed by the project's `n`, so reordering content.ts cannot desync them.
    items: Record<string, { blurb: string; liveLabel?: string }>;
  };
  photos: { label: string };
  about: {
    heading: string;
    body: string;
    aside: string;
    // Keyed by the skill group's `key` in content.ts.
    groups: Record<string, string>;
  };
  reel: {
    heading: string;
    gear: string;
    tagline: string;
    drag: string;
    // {n} is substituted with the card number.
    play: string;
    title: string;
  };
  contact: {
    heading: string;
    say: string;
    hello: string;
    labels: Record<string, string>;
    builtWith: string;
  };
};
