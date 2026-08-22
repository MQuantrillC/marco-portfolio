import type { Metadata, Viewport } from "next";
import { Anton, Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { person, intro } from "@/lib/content";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const instrument = Instrument_Serif({
  weight: "400",
  style: ["italic", "normal"],
  subsets: ["latin"],
  variable: "--font-instrument",
});
const jb = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-jb" });

const description = `${intro.lead} ${intro.body}`;

export const metadata: Metadata = {
  metadataBase: new URL("https://marcoquantrill.com"),
  title: `${person.name} — ${person.role}`,
  description,
  authors: [{ name: person.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: person.name,
    title: `${person.name} — ${person.role}`,
    description,
    url: "/",
    locale: "en_US",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: person.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${person.name} — ${person.role}`,
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

export const viewport: Viewport = {
  themeColor: "#f2f0eb",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  jobTitle: person.role,
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Font variables must live on <html>, not <body>: the @theme font stacks
    // are computed on :root, and a custom property that fails substitution
    // there inherits down as empty rather than re-resolving on <body>.
    <html
      lang="en"
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
