import { notFound } from "next/navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import PhotoMarquee from "@/components/PhotoMarquee";
import Projects from "@/components/Projects";
import Reel from "@/components/Reel";
import Contact from "@/components/Contact";
import ScrollBar from "@/components/ScrollBar";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { flagCandidates } from "@/lib/content";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";

// Server component: pick the first flag asset that is actually on disk.
const flagSrc = flagCandidates.find((p) =>
  existsSync(join(process.cwd(), "public", p.replace(/^\//, "")))
);

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  // Loaded once here and handed down as slices. Six of these components are
  // client components, and a Client Component cannot read the locale itself,
  // so the dictionary crosses the boundary as props rather than as context.
  const dict = await getDictionary(lang);

  return (
    <>
      <ScrollBar />
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:bg-ink focus:text-paper focus:px-4 focus:py-2 type-label"
      >
        {dict.skipToWork}
      </a>
      <main>
        <Hero
          flagSrc={flagSrc}
          lang={lang}
          role={dict.role}
          lead={dict.hero.lead}
          flag={dict.flag}
          t={dict.switch}
        />
        <Projects t={dict.projects} />
        <PhotoMarquee label={dict.photos.label} />
        <About t={dict.about} />
        <Reel t={dict.reel} />
        <Contact t={dict.contact} />
      </main>
    </>
  );
}
