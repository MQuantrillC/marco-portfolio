"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { person, intro, portrait } from "@/lib/content";
import Flag from "./Flag";

function LocalClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: person.timezone,
        }).format(new Date())
      );
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);

  // Rendered only after mount so server and client markup always agree.
  return <span suppressHydrationWarning>{time ?? "--:--"}</span>;
}

const rise = {
  hidden: { y: "110%" },
  show: (i: number) => ({
    y: "0%",
    transition: { duration: 0.9, delay: 0.15 + i * 0.09, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function Hero({ flagSrc }: { flagSrc?: string }) {
  return (
    <header className="relative min-h-[86svh] flex flex-col justify-between px-4 pt-5 pb-6 sm:px-6 lg:px-8">
      {/* top meta bar */}
      <div className="rule-thick pt-3 flex items-center justify-between gap-4 type-label">
        <span className="flex items-center gap-3">
          {flagSrc && <Flag src={flagSrc} />}
          {person.location}
        </span>
        <span className="tabular-nums">
          <LocalClock /> PET
        </span>
      </div>

      {/* the name */}
      <div className="flex-1 flex flex-col justify-center pb-8 pt-8 sm:justify-end sm:pb-10 sm:pt-10">
        <h1 className="type-mega">
          <span className="block overflow-hidden">
            <motion.span
              className="block"
              variants={rise}
              custom={0}
              initial="hidden"
              animate="show"
            >
              {person.first}
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              className="block"
              variants={rise}
              custom={1}
              initial="hidden"
              animate="show"
            >
              {person.last}
            </motion.span>
          </span>
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.8 }}
          className="mt-7 flex flex-col gap-7 sm:mt-8 sm:flex-row sm:items-end sm:justify-between sm:gap-10"
        >
          <p className="max-w-2xl text-2xl leading-[1.15] sm:text-3xl lg:text-[2.5rem]">
            <span className="font-[family-name:var(--font-serif)] italic">
              {intro.lead}
            </span>
          </p>

          <div className="flex items-end gap-4 shrink-0">
            <Image
              src={portrait}
              alt={person.name}
              width={300}
              height={300}
              priority
              className="w-20 h-20 sm:w-24 sm:h-24 object-cover shrink-0 grayscale"
            />
            <p className="type-label leading-relaxed text-ink-soft">
              {person.role}
              <br />
              <a
                href={`mailto:${person.email}`}
                className="text-ink border-b-2 border-accent hover:bg-accent hover:text-paper transition-colors"
              >
                {person.email}
              </a>
            </p>
          </div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="rule pt-3 flex items-center justify-between type-label"
      >
        <span>Scroll</span>
        <motion.span
          aria-hidden
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          &#8595;
        </motion.span>
      </motion.div>
    </header>
  );
}
