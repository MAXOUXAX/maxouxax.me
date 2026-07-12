"use client";

import { Link, usePathname } from "~/i18n/navigation";
import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { ListIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

import { navItems } from "~/config/navigation";
import { StaggeredFade } from "./staggered-fade";
import ThemeSwitcher from "./theme-switcher";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "~/lib/utils";
import { unbounded } from "~/lib/fonts";

const BASE_DELAY = 1.0;

const itemVariants: Variants = {
  hidden: { opacity: 0, y: -8, filter: "blur(4px)" },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 140,
      damping: 18,
      delay: BASE_DELAY + i * 0.08,
    },
  }),
};

export function Header() {
  const t = useTranslations("header");
  const pathname = usePathname();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const visibleNavItems = navItems.filter((item) => item.status === "VISIBLE");
  const showNav = visibleNavItems.length > 1;

  const isLandingPage = pathname === "/";
  const logoDelay = isLandingPage ? BASE_DELAY + 0.15 : 0;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 sm:px-8 sm:py-6">
      {/* Brand + Navigation (left corner) */}
      <div className="flex items-center gap-8">
        <motion.div
          variants={itemVariants}
          custom={0}
          initial={isLandingPage ? "hidden" : false}
          animate="show"
          className="pointer-events-auto"
        >
          <Link
            href="/"
            className="group flex items-center transition-transform active:scale-95"
            aria-label="MAXOUXAX Home"
          >
            <StaggeredFade
              as="span"
              text="MAXOUXAX"
              delay={logoDelay}
              className={cn(
                unbounded.className,
                "text-[13px] font-black tracking-tight transition-opacity duration-300 group-hover:opacity-60 sm:text-sm",
              )}
            />
          </Link>
        </motion.div>

        {showNav && (
          <nav className="pointer-events-auto hidden items-center gap-1 sm:flex">
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
                  initial={isLandingPage ? "hidden" : false}
                  animate="show"
                >
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground relative rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide uppercase transition-colors duration-250 select-none"
                    onMouseEnter={() => setHoveredPath(item.href)}
                    onMouseLeave={() => setHoveredPath(null)}
                  >
                    {/* Sliding Hover Background Pill */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.span
                          layoutId="navHover"
                          className="bg-foreground/5 absolute inset-0 -z-10 rounded-full dark:bg-white/5"
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
                        className="bg-primary absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full shadow-[0_0_8px_rgba(var(--primary),0.5)]"
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
      </div>

      {/* Theme toggle (right corner) + mobile nav */}
      <div className="flex items-center gap-1">
        <motion.div
          variants={itemVariants}
          custom={showNav ? visibleNavItems.length + 1 : 1}
          initial={isLandingPage ? "hidden" : false}
          animate="show"
          className="pointer-events-auto"
        >
          <ThemeSwitcher />
        </motion.div>

        {showNav && (
          <motion.div
            variants={itemVariants}
            custom={visibleNavItems.length + 2}
            initial={isLandingPage ? "hidden" : false}
            animate="show"
            className="pointer-events-auto sm:hidden"
          >
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={t("open-quick-menu")}
                    className="text-muted-foreground hover:text-foreground hover:bg-foreground/5 size-9 rounded-full dark:hover:bg-white/5"
                  >
                    <ListIcon className="size-5" />
                  </Button>
                }
              />
              <DropdownMenuContent
                align="end"
                className="w-52 rounded-3xl p-3.5"
                sideOffset={8}
              >
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
                          "hover:bg-accent hover:text-accent-foreground flex w-full items-center rounded-xl px-2.5 py-1.5 text-xs font-semibold tracking-wide uppercase transition-colors",
                          isActive
                            ? "bg-accent/60 text-foreground font-bold"
                            : "text-muted-foreground",
                        )}
                      >
                        {t(item.labelKey)}
                      </Link>
                    );
                  })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        )}
      </div>
    </header>
  );
}
