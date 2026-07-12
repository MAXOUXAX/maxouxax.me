import { type MetadataRoute } from "next";

import { routing } from "~/i18n/routing";
import { getSortedProjects, projectsI18n } from "~/lib/projects-source";

const BASE_URL = "https://maxouxax.me";

function localized(path: string) {
  return Object.fromEntries(
    routing.locales.map((locale) => [locale, `${BASE_URL}/${locale}${path}`]),
  );
}

function entriesFor(
  path: string,
  options: Omit<MetadataRoute.Sitemap[number], "url" | "alternates">,
): MetadataRoute.Sitemap {
  const languages = localized(path);
  return routing.locales.map((locale) => ({
    url: `${BASE_URL}/${locale}${path}`,
    alternates: { languages },
    ...options,
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const projects = getSortedProjects(projectsI18n.defaultLanguage);

  return [
    ...entriesFor("", { lastModified, changeFrequency: "weekly", priority: 1 }),
    ...entriesFor("/projects", {
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    }),
    ...projects.flatMap((project) =>
      entriesFor(`/projects/${project.slugs.join("/")}`, {
        lastModified: project.data.date,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }),
    ),
  ];
}
