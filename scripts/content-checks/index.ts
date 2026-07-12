import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..", "..");
const contentDir = path.join(projectRoot, "content", "projects");
const publicDir = path.join(projectRoot, "public");

type Violation = string;

function isLocaleVariant(filename: string): boolean {
  // matches "<slug>.fr.mdx"
  return /\.[a-z]{2}\.mdx$/.test(filename);
}

function baseSlugFromEnglishFile(filename: string): string | null {
  if (!filename.endsWith(".mdx")) return null;
  if (isLocaleVariant(filename)) return null;
  return filename.slice(0, -".mdx".length);
}

async function main() {
  const violations: Violation[] = [];

  if (!existsSync(contentDir)) {
    console.error(
      `Missing content directory: ${path.relative(projectRoot, contentDir)}`,
    );
    process.exitCode = 1;
    return;
  }

  const entries = await fs.readdir(contentDir);
  const mdxFiles = entries.filter((f) => f.endsWith(".mdx"));

  const englishSlugs = mdxFiles
    .map(baseSlugFromEnglishFile)
    .filter((s): s is string => s !== null);

  const frenchSlugs = mdxFiles
    .filter((f) => f.endsWith(".fr.mdx"))
    .map((f) => f.slice(0, -".fr.mdx".length));

  // (a) every English file must have a French sibling and vice versa.
  for (const slug of englishSlugs) {
    if (!frenchSlugs.includes(slug)) {
      violations.push(
        `content/projects/${slug}.mdx is missing its French translation: content/projects/${slug}.fr.mdx`,
      );
    }
  }
  for (const slug of frenchSlugs) {
    if (!englishSlugs.includes(slug)) {
      violations.push(
        `content/projects/${slug}.fr.mdx has no base English file: content/projects/${slug}.mdx`,
      );
    }
  }

  // (b) cover file must exist under /public, (c) og.png must exist.
  for (const slug of englishSlugs) {
    const filePath = path.join(contentDir, `${slug}.mdx`);
    const raw = await fs.readFile(filePath, "utf8");
    const { data } = matter(raw);

    const cover = data.cover as string | undefined;
    if (!cover) {
      violations.push(
        `content/projects/${slug}.mdx is missing the required "cover" frontmatter field.`,
      );
    } else {
      const coverPath = path.join(publicDir, cover.replace(/^\//, ""));
      if (!existsSync(coverPath)) {
        violations.push(
          `content/projects/${slug}.mdx declares cover "${cover}" but the file does not exist at public${cover}.`,
        );
      }
    }

    for (const ogFile of ["og.png", "og.fr.png"]) {
      const ogPath = path.join(publicDir, "projects", slug, ogFile);
      if (!existsSync(ogPath)) {
        violations.push(
          `public/projects/${slug}/${ogFile} is missing — run \`bun run og:generate\`.`,
        );
      }
    }

    if (
      !data.title ||
      typeof data.title !== "string" ||
      data.title.trim() === ""
    ) {
      violations.push(
        `content/projects/${slug}.mdx is missing a required "title" frontmatter field.`,
      );
    }
    if (!data.description || typeof data.description !== "string") {
      violations.push(
        `content/projects/${slug}.mdx is missing a required "description" frontmatter field.`,
      );
    }
    if (!data.date) {
      violations.push(
        `content/projects/${slug}.mdx is missing a required "date" frontmatter field.`,
      );
    }
    if (!Array.isArray(data.labels) || data.labels.length === 0) {
      violations.push(
        `content/projects/${slug}.mdx must declare at least one label.`,
      );
    }
  }

  if (violations.length > 0) {
    console.error("Content check failed:\n");
    for (const v of violations) console.error(`  - ${v}`);
    console.error(`\n${violations.length} violation(s) found.`);
    process.exitCode = 1;
    return;
  }

  console.log(`Content check passed for ${englishSlugs.length} project(s).`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exitCode = 1;
});
