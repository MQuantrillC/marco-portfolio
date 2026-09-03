import type { Dictionary } from "./config";

const en: Dictionary = {
  role: "Software Developer & Business Analyst",
  skipToWork: "Skip to work",
  switch: { label: "ES", title: "Ver esta página en español" },

  hero: {
    lead: "I build tools that turn data into decisions.",
  },

  flag: {
    hintTitle: "My personal flag",
    hintBody: "I designed it myself. Click to see it larger.",
    dialogTitle: "My personal flag",
    close: "Close",
    alt: "Marco Quantrill's personal armorial banner",
  },

  projects: {
    heading: "Selected work",
    open: "Open app",
    source: "Source",
    openIn: "Open {title} in a new tab",
    screenshot: "{title} screenshot",
    items: {
      "01": {
        blurb:
          "Reads Peruvian bank notification emails from BCP, Yape, BBVA and Interbank through a self-installing Gmail script, then categorises, budgets and splits the spend automatically. Multi-user, Google sign-in, Postgres behind it.",
      },
      "02": {
        blurb:
          "A timestamp-accurate timer for personal projects, with per-session history you can filter by project and period. Postgres-backed accounts keep it in sync across devices.",
      },
      "03": {
        blurb:
          "Puts economies side by side on indicators, demographics, trade and safety metrics, pulled live from official sources so the comparison is never stale.",
      },
      "04": {
        blurb:
          "Modern portfolio theory made interactive. Pulls real-time market data, then builds and stress-tests an optimal allocation you can actually poke at.",
      },
      "05": {
        blurb:
          "Personal budgeting across currencies, with live exchange rates, forward projections and charts that make the cash-flow shape obvious at a glance.",
      },
      "06": {
        blurb:
          "Hold a lone outpost in the deep desert against escalating raider assaults, building walls, towers and collectors between waves, then fighting on the ground yourself as the Commander. Every unit, effect and sound is generated in code: no image files, no audio files, just draw calls and synthesised waveforms.",
        liveLabel: "Play in browser",
      },
    },
  },

  photos: { label: "Photography" },

  about: {
    heading: "About",
    body: "Finance and international business by training, developer by practice. I work end to end: Python and SQL underneath, Next.js and TypeScript on top. What I care about most is the moment a messy spreadsheet becomes something someone can actually act on.",
    aside:
      "Off the clock: snowboarding, surfing, hiking, and flying a drone over places that deserve it.",
    groups: {
      build: "Build",
      data: "Data & BI",
      automate: "Automate & ship",
      markets: "Markets",
    },
  },

  reel: {
    heading: "The reel",
    gear: "DJI Mini 4 Pro \u00b7 Insta360 X4",
    tagline: "Places worth the altitude.",
    drag: "Drag or swipe \u2192",
    play: "Play drone reel {n}",
    title: "Drone reel {n}",
  },

  contact: {
    heading: "Get in touch",
    say: "Say",
    hello: "hello",
    labels: {
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
      whatsapp: "WhatsApp",
    },
    builtWith: "Built with Next.js",
  },
};

export default en;
