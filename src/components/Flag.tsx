"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { flagMeta, flagCopy } from "@/lib/content";

const FIRST_HINT_AFTER = 7000;   // let the hero land before nudging
const HINT_VISIBLE_FOR = 6500;
const HINT_REPEAT_EVERY = 34000;

export default function Flag({ src }: { src: string }) {
  const [hint, setHint] = useState(false);
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false); // stop nudging once acknowledged
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Periodic hint. Stops for good after the flag is opened or dismissed.
  useEffect(() => {
    if (done) return;
    let hideId: ReturnType<typeof setTimeout>;
    const show = () => {
      setHint(true);
      hideId = setTimeout(() => setHint(false), HINT_VISIBLE_FOR);
    };
    const firstId = setTimeout(show, FIRST_HINT_AFTER);
    const loopId = setInterval(show, HINT_REPEAT_EVERY + FIRST_HINT_AFTER);
    return () => {
      clearTimeout(firstId);
      clearTimeout(hideId);
      clearInterval(loopId);
    };
  }, [done]);

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  // Escape to close, and lock the page behind the dialog.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  return (
    <span className="relative inline-flex shrink-0">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          setOpen(true);
          setHint(false);
          setDone(true);
        }}
        aria-label={`${flagCopy.hintTitle} — ${flagCopy.hintBody}`}
        className="-my-1 flex min-h-11 cursor-pointer items-center py-1
                   transition-transform duration-300 hover:scale-105"
      >
        <Image
          src={src}
          alt={flagMeta.alt}
          width={flagMeta.width}
          height={flagMeta.height}
          priority
          className="h-9 w-auto sm:h-10"
        />
      </button>

      {/* periodic nudge */}
      <AnimatePresence>
        {hint && !open && (
          <motion.span
            role="status"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-[calc(100%+10px)] z-40 w-[min(17rem,calc(100vw-2.5rem))]
                       border border-ink bg-paper px-3.5 py-3 shadow-[6px_6px_0_0_var(--color-ink)]
                       normal-case tracking-normal"
          >
            <span className="type-label block text-accent">{flagCopy.hintTitle}</span>
            <span className="mt-1.5 block font-[family-name:var(--font-sans)] text-[0.8rem] leading-snug text-ink-soft">
              {flagCopy.hintBody}
            </span>
            <button
              type="button"
              onClick={() => {
                setHint(false);
                setDone(true);
              }}
              className="type-label -mb-2 -ml-2 mt-1 inline-flex min-h-11 items-center px-2 pb-2 pt-1
                         text-ink underline underline-offset-2 hover:text-accent"
            >
              {flagCopy.close}
            </button>
          </motion.span>
        )}
      </AnimatePresence>

      {/* expanded view */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-labelledby="flag-dialog-title"
            className="fixed inset-0 z-[100] grid place-items-center bg-ink/85 p-4 sm:p-8
                       normal-case tracking-normal"
          >
            <motion.div
              initial={{ scale: 0.94, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl bg-paper p-4 sm:p-7"
            >
              <div className="flex items-start justify-between gap-4 border-b-2 border-ink pb-3">
                <h2 id="flag-dialog-title" className="type-label text-accent">
                  {flagCopy.dialogTitle}
                </h2>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={close}
                  className="type-label -m-2 shrink-0 p-2 text-ink hover:text-accent"
                >
                  {flagCopy.close} &#10005;
                </button>
              </div>

              <Image
                src={flagMeta.large}
                alt={flagMeta.alt}
                width={flagMeta.largeWidth}
                height={flagMeta.largeHeight}
                sizes="(max-width: 896px) 92vw, 896px"
                className="mt-5 h-auto w-full"
              />

              <p className="mt-5 font-[family-name:var(--font-sans)] text-sm leading-relaxed text-ink-soft">
                {flagCopy.dialogBody}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
