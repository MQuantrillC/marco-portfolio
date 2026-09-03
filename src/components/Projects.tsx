"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { projects, type Project } from "@/lib/content";
import type { Dictionary } from "@/lib/i18n/config";

type Copy = Dictionary["projects"];

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

      {/* screenshot */}
      <a
        href={p.live}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.openIn.replace("{title}", p.title)}
        className={`group lg:col-span-7 block overflow-hidden bg-ink ${
          flip ? "lg:order-1 lg:col-start-1" : "lg:order-2"
        }`}
      >
        <Image
          src={p.image}
          alt={t.screenshot.replace("{title}", p.title)}
          width={p.width}
          height={p.height}
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </a>
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
