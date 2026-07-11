import { type MetadataRoute } from "next";

import { getSortedProjects, projectsI18n } from "~/lib/projects-source";

const BASE_URL = "https://maxouxax.me";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const projects = getSortedProjects(projectsI18n.defaultLanguage);

  return [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...projects.map((project) => ({
      url: `${BASE_URL}${project.url}`,
      lastModified: project.data.date,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
