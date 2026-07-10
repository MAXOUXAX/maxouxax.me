"use client";

import { useLocale } from "next-intl";
import type { Locale } from "~/i18n/config";
import { setUserLocale } from "~/services/locale";
import { useTransition } from "react";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";

export default function LocaleSwitcher() {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();

  const toggleLocale = () => {
    const nextLocale: Locale = locale === "en" ? "fr" : "en";
    startTransition(() => {
      setUserLocale(nextLocale);
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "relative flex size-9 items-center justify-center rounded-full border border-border/40 bg-background/50 text-xs font-semibold uppercase tracking-wider backdrop-blur-md transition-all hover:bg-accent hover:text-accent-foreground shadow-sm dark:bg-transparent dark:hover:bg-input/30",
        isPending && "pointer-events-none opacity-50"
      )}
      onClick={toggleLocale}
      aria-label={`Switch to ${locale === "en" ? "French" : "English"}`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={locale}
          initial={{ opacity: 0, y: -12, filter: "blur(2px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 12, filter: "blur(2px)" }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="select-none text-[10px] font-bold"
        >
          {locale}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}

