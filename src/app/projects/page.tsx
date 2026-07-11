import { type Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { getSortedProjects } from "~/lib/projects-source";
import {
  ProjectsIndex,
  type ProjectListItem,
} from "~/components/projects/projects-index";
import { unbounded } from "~/lib/fonts";
import { SITE_URL } from "~/config/site";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.projects");
  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/projects`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/projects`,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function ProjectsPage() {
  const locale = await getLocale();
  const t = await getTranslations("projects");
  const projects = getSortedProjects(locale);

  const items: ProjectListItem[] = projects.map((project) => ({
    slug: project.slugs.join("/"),
    title: project.data.title,
    description: project.data.description,
    date: project.data.date.toISOString(),
    labels: project.data.labels,
    url: project.url,
  }));

  return (
    <div className="mx-auto w-full max-w-3xl px-5 pt-32 pb-24 sm:px-8 sm:pt-40">
      <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 flex flex-col gap-4 pb-12 motion-safe:duration-500">
        <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
          {t("eyebrow")}
        </span>
        <h1
          className={`${unbounded.className} text-4xl font-black tracking-tight sm:text-5xl`}
        >
          {t("title")}
        </h1>
        <p className="text-muted-foreground text-balance">{t("intro")}</p>
      </div>

      <ProjectsIndex projects={items} />
    </div>
  );
}
