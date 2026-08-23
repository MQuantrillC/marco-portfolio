export const person = {
  name: "Marco Quantrill",
  first: "MARCO",
  last: "QUANTRILL",
  role: "Software Developer & Business Analyst",
  location: "Lima, Peru",
  timezone: "America/Lima",
  email: "quantrillmarco@gmail.com",
  phone: "+51986932487",
  github: "https://github.com/MQuantrillC",
  linkedin: "https://www.linkedin.com/in/marco-quantrill/",
  whatsapp: "https://wa.me/51986932487",
};

// The old bio ran ~200 words. This is the same person in ~45.
export const intro = {
  lead: "I build tools that turn data into decisions.",
  body: "Finance and international business by training, developer by practice. I work end to end — Python and SQL underneath, Next.js and TypeScript on top — and I care most about the moment a messy spreadsheet becomes something someone can actually act on.",
  aside: "Off the clock: snowboarding, surfing, hiking, and flying a drone over places that deserve it.",
};

export const stats = [
  { value: 5, label: "Shipped projects", suffix: "" },
  { value: 2, label: "Languages, fluent", suffix: "" },
  { value: 15.6, label: "GPA / 20, upper fifth", suffix: "", decimals: 1 },
];

export type Project = {
  n: string;
  title: string;
  blurb: string;
  stack: string[];
  live: string;
  repo: string;
  image: string;
  width: number;
  height: number;
};

export const projects: Project[] = [
  {
    n: "01",
    title: "Personal Finance Tracker",
    blurb:
      "Reads Peruvian bank notification emails — BCP, Yape, BBVA, Interbank — through a self-installing Gmail script, then categorises, budgets and splits the spend automatically. Multi-user, Google sign-in, Postgres behind it.",
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
    blurb:
      "A timestamp-accurate timer for personal projects, with per-session history you can filter by project and period. Postgres-backed accounts keep it in sync across devices.",
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
    blurb:
      "Puts economies side by side — indicators, demographics, trade and safety metrics — pulled live from official sources so the comparison is never stale.",
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
    blurb:
      "Modern portfolio theory made interactive. Pulls real-time market data, then builds and stress-tests an optimal allocation you can actually poke at.",
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
    blurb:
      "Personal budgeting across currencies, with live exchange rates, forward projections and charts that make the cash-flow shape obvious at a glance.",
    stack: ["Next.js", "React", "Interactive Charts"],
    live: "https://budget-creator-chi.vercel.app/",
    repo: "https://github.com/MQuantrillC/Budget-Creator",
    image: "/images/My-Projects-4.webp",
    width: 1400,
    height: 628,
  },
];

export const skills = [
  {
    group: "Build",
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
    group: "Data & BI",
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
    group: "Automate & ship",
    items: ["n8n", "Google Apps Script", "Salesforce", "Docker", "Vercel", "GCP"],
  },
  {
    group: "Markets",
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

export const flagMeta = {
  width: 400,
  height: 207,
  alt: "Marco Quantrill's personal armorial banner",
  // Full-resolution version shown when the mark is expanded.
  large: "/images/personal-flag-large.webp",
  largeWidth: 1600,
  largeHeight: 827,
};

// Copy for the flag hint and its expanded view. Kept in Spanish - it is a
// personal aside on an otherwise English page. Edit freely.
export const flagCopy = {
  hintTitle: "Mi bandera personal",
  hintBody: "La diseñé yo mismo. Haz clic para verla en grande.",
  dialogTitle: "Mi bandera personal",
  close: "Cerrar",
};
