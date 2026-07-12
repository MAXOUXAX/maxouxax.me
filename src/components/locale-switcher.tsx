"use client";

import { useTransition } from "react";
import { GlobeIcon } from "@phosphor-icons/react";
import { motion, type Variants } from "motion/react";
import { useLocale, useTranslations } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { locales } from "~/i18n/config";
import { usePathname, useRouter } from "~/i18n/navigation";
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
  const router = useRouter();
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  const selectLocale = (next: string) => {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial={isLandingPage ? "hidden" : false}
      animate="show"
      className="pointer-events-auto fixed bottom-5 left-5 z-50 sm:bottom-6 sm:left-8"
    >
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              aria-label={t("label")}
              className={cn(
                "text-muted-foreground/60 hover:text-foreground flex cursor-pointer items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase transition-colors duration-250 select-none",
                isPending && "pointer-events-none opacity-50",
              )}
            />
          }
        >
          <GlobeIcon className="size-3.5" />
          {locale}
        </DropdownMenuTrigger>

        <DropdownMenuContent side="top" align="start" sideOffset={10}>
          <DropdownMenuRadioGroup value={locale} onValueChange={selectLocale}>
            {locales.map((l) => (
              <DropdownMenuRadioItem key={l} value={l}>
                {t(l)}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}
