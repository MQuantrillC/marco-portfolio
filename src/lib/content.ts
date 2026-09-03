// Everything here reads the same in English and in Spanish: names, links,
// dimensions and proper nouns. Anything that is a sentence lives in
// src/lib/i18n/en.ts and es.ts instead, keyed back to the ids used here.

export const person = {
  name: "Marco Quantrill",
  first: "MARCO",
  last: "QUANTRILL",
  location: "Lima, Peru",
  timezone: "America/Lima",
  email: "quantrillmarco@gmail.com",
  phone: "+51986932487",
  github: "https://github.com/MQuantrillC",
  linkedin: "https://www.linkedin.com/in/marco-quantrill/",
  whatsapp: "https://wa.me/51986932487",
};

export const stats = [
  { value: 6, label: "Shipped projects", suffix: "" },
  { value: 2, label: "Languages, fluent", suffix: "" },
  { value: 15.6, label: "GPA / 20, upper fifth", suffix: "", decimals: 1 },
];

export type Project = {
  // Also the key into `projects.items` in each dictionary, where the blurb and
  // any call-to-action override live.
  n: string;
  title: string;
  stack: string[];
  live: string;
  // Optional: Rifthold ships as a build, with no public source repo.
  repo?: string;
  image: string;
  width: number;
  height: number;
};

export const projects: Project[] = [
  {
    n: "01",
    title: "Personal Finance Tracker",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
    live: "https://personal-finance-tracker-kohl-three.vercel.app/",
    repo: "https://github.com/MQuantrillC/personal-finance-tracker",
    image: "/images/My-Projects-6.webp",
    width: 1400,
    height: 683,
  },
  {
    n: "02",
    title: "TimeTrack",
    stack: ["Next.js", "React", "TypeScript", "PostgreSQL"],
    live: "https://time-track-eight-lyart.vercel.app/",
    repo: "https://github.com/MQuantrillC/TimeTrack",
    image: "/images/My-Projects-5.webp",
    width: 1400,
    height: 734,
  },
  {
    n: "03",
    title: "Country Profile Comparator",
    stack: ["Next.js", "React", "REST APIs"],
    live: "https://country-profile-three.vercel.app/",
    repo: "https://github.com/MQuantrillC/Country-Profile",
    image: "/images/My-Projects-2.webp",
    width: 1400,
    height: 627,
  },
  {
    n: "04",
    title: "Optimal Portfolio Dashboard",
    stack: ["Streamlit", "Python", "Pandas", "Finance APIs"],
    live: "https://mq-portfolio-dashboard.streamlit.app/",
    repo: "https://github.com/MQuantrillC/MQ-Portfolio-Dashboard",
    image: "/images/My-Projects-1.webp",
    width: 1400,
    height: 631,
  },
  {
    n: "05",
    title: "Budget Creator",
    stack: ["Next.js", "React", "Interactive Charts"],
    live: "https://budget-creator-chi.vercel.app/",
    repo: "https://github.com/MQuantrillC/Budget-Creator",
    image: "/images/My-Projects-4.webp",
    width: 1400,
    height: 628,
  },
  {
    n: "06",
    title: "Rifthold",
    stack: ["Godot 4", "GDScript", "A* Pathfinding", "WebAssembly"],
    live: "https://mquantrillc.itch.io/rifthold",
    image: "/images/My-Projects-7.webp",
    width: 1400,
    height: 788,
  },
];

// `key` looks up the group heading in the dictionaries. The items are product
// names, so they are the same in both languages.
export const skills = [
  {
    key: "build",
    items: [
      "TypeScript",
      "Next.js",
      "React",
      "Python",
      "Streamlit",
      "Prisma",
      "REST APIs",
      "HTML/CSS",
    ],
  },
  {
    key: "data",
    items: [
      "SQL",
      "PostgreSQL",
      "BigQuery",
      "Looker Studio",
      "pandas",
      "NumPy",
      "Power BI",
      "Excel",
      "Google Sheets",
    ],
  },
  {
    key: "automate",
    items: ["n8n", "Google Apps Script", "Salesforce", "Docker", "Vercel", "GCP"],
  },
  {
    key: "markets",
    items: [
      "Technical analysis",
      "Fundamental analysis",
      "Portfolio theory",
      "Bloomberg",
      "TradingView",
      "Yahoo Finance",
    ],
  },
];

export const videos = [
  "lPMZ-DDNFJI",
  "s1qT1yMhu0Q",
  "1fPH_AR75hE",
  "pDVNUEkKiG0",
  "Jv7iBFwrgxc",
  "cFscdUeGsRs",
  "DBNt-dti7G8",
  "CcH9WU46s24",
  "n4FYvx4ThR8",
];

// Personal-Photo-5 is the portrait, used separately.
export const photos = [
  1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
].map((n) => `/images/Personal-Photo-${n}.webp`);

export const portrait = "/images/Personal-Photo-5.webp";

// Personal armorial banner. Optional: page.tsx looks for the first of these
// that actually exists in public/ at build time and passes it to the hero.
// If none is present the flag is simply not rendered - no request, no
// broken image. Drop a file at public/images/flag.<ext> to switch it on.
export const flagCandidates = [
  "/images/personal-flag.webp",
  "/images/personal-flag.png",
  "/images/flag.webp",
  "/images/flag.png",
];

// The copy that goes with it, including the alt text, is in the dictionaries
// under `flag`. It used to be Spanish on an otherwise English page. Now that
// there is a Spanish page, it follows whichever one you are reading.
export const flagMeta = {
  width: 400,
  height: 207,
  // Full-resolution version shown when the mark is expanded.
  large: "/images/personal-flag-large.webp",
  largeWidth: 1600,
  largeHeight: 827,
};
