"use client";

import { motion } from "motion/react";
import { skills } from "@/lib/content";
import type { Dictionary } from "@/lib/i18n/config";

export default function About({ t }: { t: Dictionary["about"] }) {
  return (
    <section id="about" className="bg-ink text-paper px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
      <div className="pt-3 type-label border-t-[5px] border-paper flex justify-between">
        <h2>{t.heading}</h2>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7 }}
        className="mt-10 max-w-4xl text-xl sm:text-2xl lg:text-[2.1rem] leading-[1.28]"
      >
        {t.body}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="mt-8 max-w-2xl font-[family-name:var(--font-serif)] italic text-lg sm:text-xl text-paper/60"
      >
        {t.aside}
      </motion.p>

      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((s, i) => (
          <motion.div
            key={s.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="border-t border-paper/25 pt-4"
          >
            <h3 className="type-label text-accent">{t.groups[s.key]}</h3>
            <ul className="mt-3 space-y-1.5 text-paper/75">
              {s.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
