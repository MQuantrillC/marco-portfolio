"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { projects, type Project } from "@/lib/content";
import type { Dictionary } from "@/lib/i18n/config";

type Copy = Dictionary["projects"];

// The screenshot column. Without a video it links to the live app, as it
// always has. With one, the screenshot becomes the poster: nothing from
// YouTube loads until play is pressed, and the player then sits over the image
// in the same box, so the row never changes height. Same rule as the reel.
function Media({ p, t, flip }: { p: Project; t: Copy; flip: boolean }) {
  const [playing, setPlaying] = useState(false);

  const box = `group relative lg:col-span-7 block overflow-hidden bg-ink ${
    flip ? "lg:order-1 lg:col-start-1" : "lg:order-2"
  }`;

  const shot = (
    <Image
      src={p.image}
      alt={t.screenshot.replace("{title}", p.title)}
      width={p.width}
      height={p.height}
      sizes="(max-width: 1024px) 100vw, 58vw"
      // No hover zoom once a video is playing. It would only animate unseen
      // under the player.
      className={
        playing
          ? "w-full h-auto"
          : "w-full h-auto transition-transform duration-700 group-hover:scale-[1.03]"
      }
    />
  );

  if (!p.video) {
    return (
      <a
        href={p.live}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.openIn.replace("{title}", p.title)}
        className={box}
      >
        {shot}
      </a>
    );
  }

  return (
    <div className={box}>
      {shot}
      {playing ? (
        // Unmuted on purpose. The click is the user gesture that lets it play
        // with sound, and for Rifthold the synthesised audio is half the point.
        <iframe
          src={`https://www.youtube.com/embed/${p.video}?autoplay=1&playsinline=1&rel=0`}
          title={t.demo.replace("{title}", p.title)}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={t.play.replace("{title}", p.title)}
          className="absolute inset-0 grid w-full h-full cursor-pointer place-items-center"
        >
          <span className="grid place-items-center w-14 h-14 rounded-full bg-paper text-ink transition-colors group-hover:bg-accent group-hover:text-paper">
            <svg width="16" height="18" viewBox="0 0 16 18" fill="currentColor" aria-hidden>
              <path d="M16 9 0 18V0z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}

function Row({ p, i, t }: { p: Project; i: number; t: Copy }) {
  const flip = i % 2 === 1;
  const item = t.items[p.n];

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="rule py-8 sm:py-12 lg:py-16 grid gap-6 lg:grid-cols-12 lg:gap-8"
    >
      {/* index + title */}
      <div
        className={`lg:col-span-5 flex flex-col ${
          flip ? "lg:order-2 lg:col-start-8" : "lg:order-1"
        }`}
      >
        <h3 className="type-huge">{p.title}</h3>

        <p className="mt-5 max-w-md text-[0.98rem] leading-relaxed text-ink-soft">
          {item.blurb}
        </p>

        <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-2">
          {p.stack.map((s) => (
            <li key={s} className="type-label border border-ink px-2.5 py-1.5">
              {s}
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href={p.live}
            target="_blank"
            rel="noopener noreferrer"
            className="type-label bg-ink text-paper px-5 py-3.5 hover:bg-accent transition-colors"
          >
            {item.liveLabel ?? t.open} &#8599;
          </a>
          {p.repo && (
            <a
              href={p.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="type-label border border-ink px-5 py-3.5 hover:bg-ink hover:text-paper transition-colors"
            >
              {t.source}
            </a>
          )}
        </div>
      </div>

      <Media p={p} t={t} flip={flip} />
    </motion.article>
  );
}

export default function Projects({ t }: { t: Copy }) {
  return (
    <section id="work" className="px-4 sm:px-6 lg:px-8 pb-8">
      <h2 className="sr-only">{t.heading}</h2>

      {projects.map((p, i) => (
        <Row key={p.n} p={p} i={i} t={t} />
      ))}
    </section>
  );
}
