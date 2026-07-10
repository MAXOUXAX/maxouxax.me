"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { ListIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

import { navItems } from "~/config/navigation";
import LocaleSwitcher from "./locale-switcher";
import { StaggeredFade } from "./staggered-fade";
import ThemeSwitcher from "./theme-switcher";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "~/lib/utils";

const BASE_DELAY = 1.0;

const shellVariants: Variants = {
  hidden: { y: -24, opacity: 0, filter: "blur(8px)" },
  show: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 20,
      delay: BASE_DELAY,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: -8, filter: "blur(4px)" },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 140,
      damping: 18,
      delay: BASE_DELAY + 0.15 + i * 0.05,
    },
  }),
};


export function Header() {
  const t = useTranslations("header");
  const pathname = usePathname();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const visibleNavItems = navItems.filter((item) => item.status === "VISIBLE");
  const showNav = visibleNavItems.length > 1;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <motion.div
        variants={shellVariants}
        initial="hidden"
        animate="show"
        className="pointer-events-auto relative flex w-full max-w-2xl items-center justify-between rounded-full border border-border/40 bg-background/60 px-4 py-2 shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] backdrop-blur-lg dark:bg-background/40 dark:shadow-[0_16px_48px_0_rgba(0,0,0,0.35)]"
      >
        {/* Brand/Logo */}
        <motion.div
          variants={itemVariants}
          custom={0}
          className="relative flex items-center"
        >
          <Link
            href="/"
            className="group relative flex items-center gap-2 rounded-full px-3.5 py-1.5 transition-transform active:scale-95"
            aria-label="MAXOUXAX Home"
          >
            <span className="absolute inset-0 rounded-full bg-foreground/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-white/5" />
            <StaggeredFade
              as="span"
              text="MAXOUXAX"
              className="text-xs font-black tracking-wider uppercase sm:text-sm"
            />
          </Link>
        </motion.div>

        {/* Center Navigation Links (Desktop) */}
        {showNav && (
          <nav className="hidden items-center gap-1 sm:flex">
            {visibleNavItems.map((item, index) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.href);
              const isHovered = hoveredPath === item.href;

              return (
                <motion.div
                  key={item.href}
                  variants={itemVariants}
                  custom={index + 1}
                >
                  <Link
                    href={item.href}
                    className="relative rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide uppercase transition-colors duration-250 select-none text-muted-foreground hover:text-foreground"
                    onMouseEnter={() => setHoveredPath(item.href)}
                    onMouseLeave={() => setHoveredPath(null)}
                  >
                    {/* Sliding Hover Background Pill */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.span
                          layoutId="navHover"
                          className="absolute inset-0 -z-10 rounded-full bg-foreground/5 dark:bg-white/5"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                    </AnimatePresence>

                    <span className="relative z-10">{t(item.labelKey)}</span>

                    {/* Active Page Indicator (sliding line/dot) */}
                    {isActive && (
                      <motion.span
                        layoutId="activeDot"
                        className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]"
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 25,
                        }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        )}

        {/* Right Switchers (Desktop) */}
        <div className="hidden items-center gap-2 sm:flex">
          <motion.div variants={itemVariants} custom={3}>
            <ThemeSwitcher />
          </motion.div>
          <motion.div variants={itemVariants} custom={4}>
            <LocaleSwitcher />
          </motion.div>
        </div>

        {/* Mobile quick menu */}
        <motion.div
          variants={itemVariants}
          custom={1}
          className="flex items-center sm:hidden"
        >
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t("open-quick-menu")}
                  className="pointer-events-auto size-9 rounded-full border border-border/40 bg-background/50 backdrop-blur-md shadow-sm dark:bg-transparent dark:hover:bg-input/30"
                >
                  <ListIcon className="size-5" />
                </Button>
              }
            />
            <DropdownMenuContent
              align="end"
              className="w-52 space-y-3.5 p-3.5 rounded-3xl"
              sideOffset={8}
            >
              {showNav && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                      Navigation
                    </span>
                    <div className="flex flex-col gap-1">
                      {visibleNavItems.map((item) => {
                        const isActive =
                          item.href === "/"
                            ? pathname === "/"
                            : pathname?.startsWith(item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "flex w-full items-center rounded-xl px-2.5 py-1.5 text-xs font-semibold tracking-wide uppercase transition-colors hover:bg-accent hover:text-accent-foreground",
                              isActive
                                ? "bg-accent/60 text-foreground font-bold"
                                : "text-muted-foreground"
                            )}
                          >
                            {t(item.labelKey)}
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  <div className="h-px bg-border/50" />
                </>
              )}

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  {t("theme")}
                </span>
                <ThemeSwitcher />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  {t("language")}
                </span>
                <LocaleSwitcher />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>

        {/* Ambient bottom glow divider */}
        <motion.div
          className="via-foreground/15 absolute inset-x-8 bottom-0 h-px bg-linear-to-r from-transparent to-transparent"
          animate={{ opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
      </motion.div>
    </header>
  );
}

