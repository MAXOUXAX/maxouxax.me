"use client";

import Link from "next/link";
import { motion, stagger, type Variants } from "motion/react";
import { ListIcon } from "@phosphor-icons/react";

import LocaleSwitcher from "./locale-switcher";
import { StaggeredFade } from "./staggered-fade";
import ThemeSwitcher from "./theme-switcher";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("header");

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-4">
      <motion.div
        variants={shellVariants}
        initial="hidden"
        animate="show"
        className="bg-background/85 ring-foreground/5 pointer-events-auto relative flex w-full max-w-4xl items-center gap-2 overflow-hidden rounded-[26px] border border-white/10 px-3 py-2 shadow-[0_16px_60px_-24px_rgba(0,0,0,0.55)] ring-1 backdrop-blur-2xl sm:gap-3 sm:px-4 sm:py-3"
      >
        <motion.div
          variants={itemVariants}
          custom={0}
          className="relative flex min-w-0 shrink items-center gap-2 rounded-full px-2.5 py-1.5 sm:gap-3 sm:px-3 sm:py-2"
        >
          <motion.span
            className="bg-foreground/5 pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500"
            whileHover={{ opacity: 1 }}
            aria-hidden
          />
          <Link href="/" className="relative flex items-center gap-3">
            <StaggeredFade
              as="span"
              text="MAXOUXAX"
              className="text-sm font-black tracking-tight sm:text-lg"
            />
          </Link>
        </motion.div>

        <motion.div className="ml-auto hidden items-center gap-1.5 rounded-full px-1.5 py-1 sm:flex sm:gap-3 sm:px-2">
          <motion.div variants={itemVariants} custom={1}>
            <ThemeSwitcher />
          </motion.div>
          <motion.div variants={itemVariants} custom={2}>
            <LocaleSwitcher />
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemContainerVariants}
          custom={1}
          className="ml-auto flex items-center sm:hidden"
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label={t("open-quick-menu")}
                className="pointer-events-auto"
              >
                <ListIcon className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-60 space-y-3 p-3"
              sideOffset={8}
            >
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  {t("theme")}
                </span>
                <ThemeSwitcher />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  {t("language")}
                </span>
                <LocaleSwitcher />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
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
