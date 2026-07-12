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
  // Routing is locale-prefixed ("always"), so the default "never" is what we
  // want: page.url is `/en/projects/<slug>` / `/fr/projects/<slug>`.
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
      : pages.slice();
  return visible.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
