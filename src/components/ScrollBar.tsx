"use client";

import { motion, useScroll, useSpring } from "motion/react";

export default function ScrollBar() {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.4 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX: width }}
      className="fixed top-0 left-0 right-0 h-1 bg-accent origin-left z-50"
    />
  );
}
