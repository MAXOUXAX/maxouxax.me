"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
} from "motion/react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "~/components/ui/empty";
import { cn } from "~/lib/utils";

export type ProjectListItem = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO string
  labels: string[];
  url: string;
};

function groupByYear(projects: ProjectListItem[]) {
  const groups = new Map<number, ProjectListItem[]>();
  for (const project of projects) {
    const year = new Date(project.date).getFullYear();
    const bucket = groups.get(year) ?? [];
    bucket.push(project);
    groups.set(year, bucket);
  }
  return [...groups.entries()].sort((a, b) => b[0] - a[0]);
}

export function ProjectsIndex({ projects }: { projects: ProjectListItem[] }) {
  const t = useTranslations("projects");
  const [activeLabels, setActiveLabels] = useState<string[]>([]);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const allLabels = useMemo(() => {
    const set = new Set<string>();
    for (const project of projects) {
      for (const label of project.labels) set.add(label);
    }
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const filtered = useMemo(() => {
    if (activeLabels.length === 0) return projects;
    return projects.filter((project) =>
      project.labels.some((label) => activeLabels.includes(label)),
    );
  }, [projects, activeLabels]);

  const grouped = useMemo(() => groupByYear(filtered), [filtered]);

  return (
    <div className="flex flex-col gap-10">
      <nav aria-label={t("filter-label")} className="flex flex-wrap gap-2">
        <ToggleGroup
          value={activeLabels}
          onValueChange={(value: string[]) => setActiveLabels(value)}
          spacing={2}
          className="flex flex-wrap gap-2"
        >
          {allLabels.map((label) => (
            <ToggleGroupItem
              key={label}
              value={label}
              variant="outline"
              className="data-[state=on]:bg-foreground data-[state=on]:text-background rounded-full text-xs font-semibold tracking-wide uppercase"
              aria-label={label}
            >
              {label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        {activeLabels.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground rounded-full text-xs font-semibold tracking-wide uppercase"
            onClick={() => setActiveLabels([])}
          >
            {t("filter-all")}
          </Button>
        )}
      </nav>

      <div aria-live="polite" className="sr-only">
        {t("results-count", { count: filtered.length })}
      </div>

      {filtered.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>{t("empty-title")}</EmptyTitle>
            <EmptyDescription>{t("empty-description")}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="ghost" onClick={() => setActiveLabels([])}>
              {t("empty-reset")}
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <MotionConfig reducedMotion="user">
          <LayoutGroup>
            <div className="flex flex-col gap-10">
              {grouped.map(([year, items]) => (
                <section key={year} className="flex flex-col gap-2">
                  <h2 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                    {year}
                  </h2>
                  <ul className="divide-border/60 divide-y">
                    <AnimatePresence initial={false}>
                      {items.map((project) => (
                        <motion.li
                          key={project.slug}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{
                            type: "spring",
                            stiffness: 140,
                            damping: 18,
                          }}
                        >
                          <Link
                            href={project.url}
                            className="group focus-visible:ring-ring relative -mx-3 flex flex-col gap-1 rounded-xl px-3 py-4 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                            onMouseEnter={() => setHoveredSlug(project.slug)}
                            onMouseLeave={() => setHoveredSlug(null)}
                            onFocus={() => setHoveredSlug(project.slug)}
                            onBlur={() => setHoveredSlug(null)}
                          >
                            <AnimatePresence>
                              {hoveredSlug === project.slug && (
                                <motion.span
                                  layoutId="projectHover"
                                  className="bg-foreground/5 absolute inset-0 -z-10 rounded-xl dark:bg-white/5"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 380,
                                    damping: 30,
                                  }}
                                />
                              )}
                            </AnimatePresence>

                            <span className="flex items-center gap-1.5">
                              <span
                                className="text-lg font-semibold tracking-tight"
                                style={{
                                  viewTransitionName: `project-${project.slug}`,
                                }}
                              >
                                {project.title}
                              </span>
                              <ArrowUpRightIcon
                                aria-hidden
                                className={cn(
                                  "size-4 -translate-x-1 opacity-0 transition",
                                  "group-hover:translate-x-0 group-hover:opacity-100",
                                  "motion-reduce:transition-none",
                                )}
                              />
                            </span>
                            <span className="text-muted-foreground text-sm">
                              {project.description}
                            </span>
                            <span className="mt-1 flex flex-wrap gap-1.5">
                              {project.labels.map((label) => (
                                <Badge
                                  key={label}
                                  variant="outline"
                                  className="text-muted-foreground rounded-full text-[11px] font-medium tracking-wide uppercase"
                                >
                                  {label}
                                </Badge>
                              ))}
                            </span>
                          </Link>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </section>
              ))}
            </div>
          </LayoutGroup>
        </MotionConfig>
      )}
    </div>
  );
}
