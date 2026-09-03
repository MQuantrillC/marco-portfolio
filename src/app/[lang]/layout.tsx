import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Anton, Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { person } from "@/lib/content";
import { htmlLang, isLocale, locales, ogLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import "../globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const instrument = Instrument_Serif({
  weight: "400",
  style: ["italic", "normal"],
  subsets: ["latin"],
  variable: "--font-instrument",
});
const jb = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-jb" });

// Absolute URLs for OG/Twitter images. Vercel injects
// VERCEL_PROJECT_PRODUCTION_URL automatically, so this is correct on a
// preview or production deploy with no configuration. Set
// NEXT_PUBLIC_SITE_URL once a custom domain is pointed at the project.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

// Both locales are prerendered at build time, so neither pays for the switch.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

type Params = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const description = `${dict.hero.lead} ${dict.about.body}`;
  const title = `${person.name} · ${dict.role}`;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    authors: [{ name: person.name }],
    alternates: {
      canonical: `/${lang}`,
      // hreflang, so a Spanish speaker who finds the English page in search
      // is pointed at the Spanish one instead of bouncing.
      languages: { en: "/en", es: "/es", "x-default": "/en" },
    },
    openGraph: {
      type: "website",
      siteName: person.name,
      title,
      description,
      url: `/${lang}`,
      locale: ogLocale[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocale[l]),
      images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: person.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/og-image.jpg"],
    },
    icons: {
      icon: [
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#f2f0eb",
};

export default async function RootLayout({
  children,
  params,
}: Params & { children: React.ReactNode }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    url: `${siteUrl}/${lang}`,
    image: `${siteUrl}/images/og-image.jpg`,
    jobTitle: dict.role,
    email: `mailto:${person.email}`,
    telephone: person.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Miraflores, Lima",
      addressCountry: "PE",
    },
    knowsLanguage: ["en", "es"],
    sameAs: [person.github, person.linkedin],
  };

  return (
    // Font variables must live on <html>, not <body>: the @theme font stacks
    // are computed on :root, and a custom property that fails substitution
    // there inherits down as empty rather than re-resolving on <body>.
    <html
      lang={htmlLang[lang]}
      className={`${anton.variable} ${inter.variable} ${instrument.variable} ${jb.variable}`}
    >
      <body className="grain antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
