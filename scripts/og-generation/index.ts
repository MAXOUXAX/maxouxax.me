import fs from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import matter from "gray-matter";
import satori from "satori";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..", "..");
const contentDir = path.join(projectRoot, "content", "projects");
const publicDir = path.join(projectRoot, "public");
const fontsDir = path.join(__dirname, "fonts");

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const COVER_WIDTH = 1600;
const COVER_HEIGHT = 900;

// Hex equivalents of the site's dark theme tokens (satori cannot parse oklch()).
const COLORS = {
  background: "#0a0a0a",
  foreground: "#fafafa",
  muted: "#a3a3a3",
  border: "#27272a",
};

const force = process.argv.includes("--force");

type Frontmatter = {
  title: string;
  description: string;
  labels: string[];
};

async function loadFonts() {
  const [unbounded, inter] = await Promise.all([
    fs.readFile(path.join(fontsDir, "Unbounded-Black.ttf")),
    fs.readFile(path.join(fontsDir, "Inter-Regular.ttf")),
  ]);
  return { unbounded, inter };
}

// Minimal shape of the React-element-like tree satori accepts. We build the
// card as plain objects (no JSX/react runtime) since this script runs
// standalone under tsx, outside of the Next.js React tree.
type SatoriNode = {
  type: string;
  props: {
    style?: Record<string, string | number>;
    children?: string | SatoriNode | SatoriNode[];
  };
};

function card(fm: Frontmatter, width: number, height: number): SatoriNode {
  const isCover = width === COVER_WIDTH;

  return {
    type: "div",
    props: {
      style: {
        width,
        height,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: COLORS.background,
        padding: isCover ? 96 : 80,
        fontFamily: "Inter",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: COLORS.muted,
            },
            children: "MAXOUXAX",
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              gap: 24,
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    fontFamily: "Unbounded",
                    fontSize: isCover ? 84 : 64,
                    fontWeight: 900,
                    color: COLORS.foreground,
                    lineHeight: 1.1,
                  },
                  children: fm.title,
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    fontSize: 30,
                    color: COLORS.muted,
                    maxWidth: width - (isCover ? 192 : 160) * 2,
                  },
                  children: fm.description,
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    gap: 12,
                  },
                  children: fm.labels.slice(0, 4).map((label) => ({
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        border: `2px solid ${COLORS.border}`,
                        borderRadius: 999,
                        padding: "10px 20px",
                        fontSize: 22,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        color: COLORS.muted,
                      },
                      children: label,
                    },
                  })),
                },
              },
            ],
          },
        },
      ],
    },
  };
}

async function renderPng(
  fm: Frontmatter,
  width: number,
  height: number,
  fonts: { unbounded: Buffer; inter: Buffer },
): Promise<Buffer> {
  const svg = await satori(card(fm, width, height) as never, {
    width,
    height,
    fonts: [
      {
        name: "Unbounded",
        data: fonts.unbounded,
        weight: 900,
        style: "normal",
      },
      { name: "Inter", data: fonts.inter, weight: 400, style: "normal" },
    ],
  });

  return sharp(Buffer.from(svg)).png().toBuffer();
}

function isUpToDate(outputPath: string, sourcePath: string): boolean {
  if (!existsSync(outputPath)) return false;
  if (force) return false;
  const outStat = statSync(outputPath);
  const srcStat = statSync(sourcePath);
  return outStat.mtimeMs >= srcStat.mtimeMs;
}

async function main() {
  const fonts = await loadFonts();
  const entries = await fs.readdir(contentDir);
  const englishFiles = entries.filter(
    (f) => f.endsWith(".mdx") && !/\.[a-z]{2}\.mdx$/.test(f),
  );

  let generated = 0;
  let skipped = 0;

  for (const file of englishFiles) {
    const slug = file.slice(0, -".mdx".length);
    const sourcePath = path.join(contentDir, file);
    const raw = await fs.readFile(sourcePath, "utf8");
    const { data } = matter(raw);
    const fm = data as Frontmatter;

    const outDir = path.join(publicDir, "projects", slug);
    await fs.mkdir(outDir, { recursive: true });

    // One OG image per locale: og.png (en) from `<slug>.mdx`, og.<lang>.png
    // from `<slug>.<lang>.mdx` (localized title/description/labels).
    const localeVariants = entries.filter(
      (f) =>
        f.startsWith(`${slug}.`) &&
        f.endsWith(".mdx") &&
        /\.[a-z]{2}\.mdx$/.test(f),
    );
    const ogTargets: { src: string; out: string; fm: Frontmatter }[] = [
      { src: sourcePath, out: path.join(outDir, "og.png"), fm },
    ];
    for (const variant of localeVariants) {
      const lang = variant.slice(slug.length + 1, -".mdx".length);
      const variantPath = path.join(contentDir, variant);
      const variantRaw = await fs.readFile(variantPath, "utf8");
      ogTargets.push({
        src: variantPath,
        out: path.join(outDir, `og.${lang}.png`),
        fm: matter(variantRaw).data as Frontmatter,
      });
    }

    for (const target of ogTargets) {
      if (isUpToDate(target.out, target.src)) {
        skipped++;
      } else {
        const png = await renderPng(target.fm, OG_WIDTH, OG_HEIGHT, fonts);
        await fs.writeFile(target.out, png);
        console.log(`Wrote ${path.relative(projectRoot, target.out)}`);
        generated++;
      }
    }

    const coverPath = path.join(outDir, "cover.png");
    if (!existsSync(coverPath)) {
      const png = await renderPng(fm, COVER_WIDTH, COVER_HEIGHT, fonts);
      await fs.writeFile(coverPath, png);
      console.log(
        `Wrote placeholder ${path.relative(projectRoot, coverPath)} (replace with real imagery).`,
      );
      generated++;
    }
  }

  console.log(
    `Done. ${generated} file(s) generated, ${skipped} skipped (up to date).`,
  );
}

main().catch((err: unknown) => {
  console.error(err);
  process.exitCode = 1;
});
