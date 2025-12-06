"use server";

import { cookies, headers } from "next/headers";
import type { Locale } from "~/i18n/config";
import { defaultLocale, locales } from "~/i18n/config";

const COOKIE_NAME = "NEXT_LOCALE";

function parseAcceptLanguage(header: string | null): string[] {
  if (!header) return [];

  return header
    .split(",")
    .map((part) => {
      const [tagValue = "", ...params] = part.trim().split(";");
      const tag = tagValue.toLowerCase();
      let quality = 1;

      for (const param of params) {
        const [key, value] = param.trim().split("=");
        if (key?.toLowerCase() === "q" && value) {
          const parsed = Number.parseFloat(value);
          if (!Number.isNaN(parsed)) quality = parsed;
        }
      }

      return { tag: tag.toLowerCase(), quality };
    })
    .filter(({ tag }) => Boolean(tag))
    .sort((a, b) => b.quality - a.quality)
    .map(({ tag }) => tag);
}

function findSupportedLocale(preferred: string[]): Locale {
  for (const tag of preferred) {
    const exact = locales.find((locale) => locale === tag);
    if (exact) return exact;

    const base = tag.split("-")[0];
    const baseMatch = locales.find((locale) => locale === base);
    if (baseMatch) return baseMatch;
  }

  return defaultLocale;
}

export async function getUserLocale() {
  const cookieLocale = (await cookies()).get(COOKIE_NAME)?.value;
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }

  const acceptLanguage = (await headers()).get("accept-language");
  const preferred = parseAcceptLanguage(acceptLanguage);

  return findSupportedLocale(preferred);
}

export async function setUserLocale(locale: Locale) {
  (await cookies()).set(COOKIE_NAME, locale);
}
