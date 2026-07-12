import { loader } from "fumadocs-core/source";
import type { I18nConfig } from "fumadocs-core/i18n";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";
import { projects } from "../../.source/server";

// Must mirror src/i18n/config.ts (locales/defaultLocale).
export const projectsI18n: I18nConfig = {
  defaultLanguage: "en",
  languages: ["en", "fr"],
  // "dot" parser: `foo.mdx` is English (default), `foo.fr.mdx` is French.
  parser: "dot",
  // The site resolves locale from the NEXT_LOCALE cookie — URLs never carry
  // a locale segment, so page.url must stay `/projects/<slug>` for both
  // languages instead of the default `/fr/projects/<slug>`.
  hideLocale: "always",
};

export const projectsSource = loader({
  baseUrl: "/projects",
  i18n: projectsI18n,
  source: toFumadocsSource(projects, []),
});

export function getSortedProjects(locale: string) {
  const pages = projectsSource.getPages(locale);
  const visible =
    process.env.NODE_ENV === "production"
      ? pages.filter((p) => !p.data.draft)
      : pages;
  return visible.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
