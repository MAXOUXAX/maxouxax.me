"use client";

import { Fragment, useTransition } from "react";
import { usePathname } from "next/navigation";
import { motion, type Variants } from "motion/react";
import { useLocale, useTranslations } from "next-intl";

import { locales, type Locale } from "~/i18n/config";
import { setUserLocale } from "~/services/locale";
import { cn } from "~/lib/utils";

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 140,
      damping: 18,
      delay: 1.4,
    },
  },
};

export default function LocaleSwitcher() {
  const t = useTranslations("locale-switcher");
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  const selectLocale = (next: Locale) => {
    if (next === locale) return;
    startTransition(() => {
      void setUserLocale(next);
    });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial={isLandingPage ? "hidden" : false}
      animate="show"
      className="pointer-events-auto fixed bottom-5 left-5 z-50 sm:bottom-6 sm:left-8"
    >
      <div
        className={cn(
          "flex items-center gap-2.5 transition-opacity",
          isPending && "pointer-events-none opacity-50",
        )}
      >
        {locales.map((l, i) => (
          <Fragment key={l}>
            {i > 0 && <span aria-hidden className="bg-border h-px w-4" />}
            <button
              type="button"
              onClick={() => selectLocale(l)}
              aria-label={t(l)}
              aria-current={l === locale ? "true" : undefined}
              className={cn(
                "relative text-[11px] font-bold tracking-widest uppercase transition-colors duration-250 select-none",
                l === locale
                  ? "text-foreground"
                  : "text-muted-foreground/60 hover:text-foreground cursor-pointer",
              )}
            >
              {l}
              {l === locale && (
                <motion.span
                  layoutId="localeActive"
                  className="bg-foreground absolute inset-x-0 -bottom-1 h-px"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </button>
          </Fragment>
        ))}
      </div>
    </motion.div>
  );
}
