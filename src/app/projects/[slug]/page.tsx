import { type Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { format } from "date-fns";
import { fr as frLocale } from "date-fns/locale";
import { GithubLogoIcon, GlobeIcon } from "@phosphor-icons/react/dist/ssr";

import { projectsSource } from "~/lib/projects-source";
import { mdxComponents } from "~/components/mdx/mdx-components";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { unbounded } from "~/lib/fonts";
import { SITE_NAME, SITE_URL } from "~/config/site";

function estimateReadingMinutes(
  contents: { content: string }[] | undefined,
): number {
  const words = (contents ?? [])
    .map((c) => c.content)
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const page = projectsSource.getPage([slug], locale);

  if (!page) return {};

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: {
      canonical: `${SITE_URL}/projects/${slug}`,
    },
    openGraph: {
      type: "article",
      title: page.data.title,
      description: page.data.description,
      url: `${SITE_URL}/projects/${slug}`,
      images: [`/projects/${slug}/og.png`],
    },
    twitter: {
      card: "summary_large_image",
      title: page.data.title,
      description: page.data.description,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations("projects");
  const page = projectsSource.getPage([slug], locale);

  if (!page || (page.data.draft && process.env.NODE_ENV === "production")) {
    notFound();
  }

  const { data } = page;
  const MDX = data.body;
  const toc = data.toc;
  const readingMinutes = estimateReadingMinutes(data.structuredData?.contents);

  const dateFormatted = format(
    data.date,
    locale === "fr" ? "d MMMM yyyy" : "MMMM d, yyyy",
    locale === "fr" ? { locale: frLocale } : undefined,
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: data.title,
    description: data.description,
    datePublished: data.date.toISOString(),
    url: `${SITE_URL}/projects/${slug}`,
    author: {
      "@type": "Person",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  return (
    <article className="mx-auto w-full max-w-2xl px-5 pt-32 pb-24 sm:px-8 sm:pt-40">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-1.5">
          {data.labels.map((label) => (
            <Badge
              key={label}
              variant="outline"
              className="text-muted-foreground rounded-full text-[11px] font-medium tracking-wide uppercase"
            >
              {label}
            </Badge>
          ))}
        </div>

        <h1
          className={`${unbounded.className} text-3xl font-black tracking-tight text-balance sm:text-4xl`}
          style={{ viewTransitionName: `project-${slug}` }}
        >
          {data.title}
        </h1>

        <p className="text-muted-foreground text-lg text-balance">
          {data.description}
        </p>

        <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <time dateTime={data.date.toISOString()}>{dateFormatted}</time>
          <span aria-hidden>&middot;</span>
          <span>{t("reading-time", { minutes: readingMinutes })}</span>

          {data.links.github ? (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              nativeButton={false}
              render={
                <a
                  href={data.links.github}
                  target="_blank"
                  rel="noreferrer noopener"
                />
              }
            >
              <GithubLogoIcon aria-hidden className="size-4" />
              {t("view-github")}
            </Button>
          ) : null}

          {data.links.website ? (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              nativeButton={false}
              render={
                <a
                  href={data.links.website}
                  target="_blank"
                  rel="noreferrer noopener"
                />
              }
            >
              <GlobeIcon aria-hidden className="size-4" />
              {t("view-website")}
            </Button>
          ) : null}
        </div>
      </div>

      <div className="border-border/60 relative mt-8 aspect-video overflow-hidden rounded-3xl border">
        <Image
          src={data.cover}
          alt={t("cover-alt", { title: data.title })}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 672px"
          className="object-cover"
          style={{
            viewTransitionName: `project-cover-${page.slugs.join("/")}`,
          }}
        />
      </div>

      {toc.length >= 2 && (
        <nav aria-label={t("toc-label")} className="mt-10">
          <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            {t("toc-label")}
          </span>
          <ul className="mt-3 flex flex-col gap-1.5">
            {toc.map((item) => (
              <li
                key={item.url}
                style={{ paddingLeft: `${(item.depth - 2) * 16}px` }}
              >
                <a
                  href={item.url}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="prose prose-neutral dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-a:decoration-border prose-a:underline-offset-4 hover:prose-a:decoration-foreground prose-img:my-0 mt-12 max-w-none">
        <MDX components={mdxComponents} />
      </div>

      <div className="border-border/60 mt-16 border-t pt-8">
        <Link
          href="/projects"
          className="text-muted-foreground hover:text-foreground text-sm font-semibold tracking-wide uppercase transition-colors"
        >
          {t("back-to-projects")}
        </Link>
      </div>
    </article>
  );
}
