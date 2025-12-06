"use client";

import Link from "next/link";
import { motion, stagger, type Variants } from "motion/react";

import LocaleSwitcher from "./locale-switcher";
import { StaggeredFade } from "./staggered-fade";
import ThemeSwitcher from "./theme-switcher";

const BASE_DELAY = 1.5;

const shellVariants: Variants = {
  hidden: { y: -20, opacity: 0, filter: "blur(6px)" },
  show: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: "easeOut", delay: BASE_DELAY },
  },
};

const itemContainerVariants: Variants = {
  show: {
    transition: {
      delayChildren: stagger(2.12),
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: -6, filter: "blur(4px)" },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.45,
      ease: "easeOut",
      delay: BASE_DELAY + 0.25 + i * 0.08,
    },
  }),
};

export function Header() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-4">
      <motion.div
        variants={shellVariants}
        initial="hidden"
        animate="show"
        className="bg-background/70 ring-foreground/5 pointer-events-auto relative flex w-full max-w-6xl items-center gap-4 overflow-hidden rounded-full border border-white/10 px-4 py-3 shadow-[0_18px_70px_-26px_rgba(0,0,0,0.6)] ring-1 backdrop-blur-2xl"
      >
        <motion.div
          variants={itemVariants}
          custom={0}
          className="relative flex items-center gap-3 rounded-full px-3 py-2"
        >
          <motion.span
            className="bg-foreground/5 pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500"
            whileHover={{ opacity: 1 }}
            aria-hidden
          />
          <Link href="/" className="relative flex items-center gap-3">
            <StaggeredFade
              text="MAXOUXAX"
              className="text-lg font-black tracking-tight"
            />
          </Link>
        </motion.div>

        <motion.div
          variants={itemContainerVariants}
          custom={1}
          className="relative ml-auto flex items-center gap-2 rounded-full px-2 py-1"
        >
          <motion.div variants={itemVariants} custom={1}>
            <ThemeSwitcher />
          </motion.div>
          <motion.div variants={itemVariants} custom={2}>
            <LocaleSwitcher />
          </motion.div>
        </motion.div>

        <motion.div
          className="via-foreground/25 absolute inset-x-6 bottom-0 h-px bg-linear-to-r from-transparent to-transparent"
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
      </motion.div>
    </header>
  );
}
