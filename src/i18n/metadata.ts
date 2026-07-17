import { routing } from "~/i18n/routing";
import { SITE_URL } from "~/config/site";

/**
 * Canonical + hreflang alternates for a locale-prefixed path, derived from
 * `routing.locales` so adding a locale doesn't require updating every page
 * that sets metadata.
 */
export function localizedAlternates(locale: string, path: string) {
  return {
    canonical: `${SITE_URL}/${locale}${path}`,
    languages: {
      ...Object.fromEntries(
        routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`] as const),
      ),
      "x-default": `${SITE_URL}/${routing.defaultLocale}${path}`,
    },
  };
}
