"use client";

import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "~/i18n/config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { setUserLocale } from "~/services/locale";
import { useTransition } from "react";
import { cn } from "~/lib/utils";
import { GlobeIcon } from "@phosphor-icons/react";

export default function LocaleSwitcher() {
  const [isPending, startTransition] = useTransition();

  const t = useTranslations("locale-switcher");
  const locale = useLocale();

  const changeLocale = (locale: Locale) => {
    startTransition(() => {
      setUserLocale(locale);
    });
  };

  return (
    <Select defaultValue={locale} onValueChange={changeLocale}>
      <SelectTrigger
        className={cn(
          "w-[180px]",
          isPending && "pointer-events-none opacity-50",
        )}
      >
        <GlobeIcon className="size-4" />
        <SelectValue placeholder={t("placeholder")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">{t("en")}</SelectItem>
        <SelectItem value="fr">{t("fr")}</SelectItem>
      </SelectContent>
    </Select>
  );
}
