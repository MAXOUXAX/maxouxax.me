import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

type IconTarget = {
  /** Output filename (relative to /public). */
  file: string;
  /** Square pixel dimension used for generation. */
  size: number;
};

type LayoutIconLink = {
  rel?: string;
  url: string;
  sizes?: string;
  type?: string;
};

type ManifestIcon = {
  src: string;
  sizes: string;
  type: string;
  purpose?: "any" | "maskable" | "monochrome";
};

type PngToIco = (input: Array<Buffer | string>) => Promise<Buffer>;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..", "..");
const publicDir = path.join(projectRoot, "public");
const sourcePath = path.join(__dirname, "assets", "source.png");

const layoutFile = path.join(projectRoot, "src", "app", "layout.tsx");
const manifestFile = path.join(projectRoot, "src", "app", "manifest.ts");

const markerStart = "// [favicon-script icons start]";
const markerEnd = "// [favicon-script icons end]";

// --- Single-source config ----------------------------------------------------
// Primary PNG renditions produced into /public. Update this list to add/remove sizes.
const pngTargets: IconTarget[] = [
  { file: "icon-192.png", size: 192 },
  { file: "icon-512.png", size: 512 },
  { file: "apple-touch-icon.png", size: 180 },
];

// Sizes embedded inside favicon.ico (multi-resolution ICO). Keep 16/32/48 at minimum.
const icoSizes = [16, 32, 48, 64, 128, 256];

// Derived metadata preferences.
const faviconIcoPath = "/favicon.ico";
const appleTouchSize = 180;
const maskableSizes = [512]; // sizes (px) that should get a maskable manifest entry
// ---------------------------------------------------------------------------

function buildLayoutIcons(): {
  icons: LayoutIconLink[];
  apple: LayoutIconLink[];
  shortcuts: string[];
} {
  const icons = [
    { url: faviconIcoPath, rel: "icon" },
    ...pngTargets.map<LayoutIconLink>((t) => ({
      url: `/${t.file}`,
      sizes: `${t.size}x${t.size}`,
      type: "image/png",
    })),
  ];

  const apple = pngTargets
    .filter((t) => t.size === appleTouchSize)
    .map<LayoutIconLink>((t) => ({
      url: `/${t.file}`,
      sizes: `${t.size}x${t.size}`,
      type: "image/png",
    }));

  const shortcuts = [faviconIcoPath];

  return { icons, apple, shortcuts };
}

function buildManifestIcons(): ManifestIcon[] {
  const icons: ManifestIcon[] = [];

  for (const t of pngTargets) {
    const base = {
      src: `/${t.file}`,
      sizes: `${t.size}x${t.size}`,
      type: "image/png",
    } as const;

    icons.push({ ...base, purpose: "any" });

    if (maskableSizes.includes(t.size)) {
      icons.push({ ...base, purpose: "maskable" });
    }
  }

  return icons;
}

function renderLayoutIconsBlock(): string {
  const { icons, apple, shortcuts } = buildLayoutIcons();

  const iconLines = icons
    .map((i) => {
      const parts = [
        `url: "${i.url}"`,
        i.rel ? `rel: "${i.rel}"` : null,
        i.sizes ? `sizes: "${i.sizes}"` : null,
        i.type ? `type: "${i.type}"` : null,
      ].filter(Boolean);
      return `  { ${parts.join(", ")} },`;
    })
    .join("\n");

  const appleLines = apple
    .map((i) => {
      const parts = [
        `url: "${i.url}"`,
        i.sizes ? `sizes: "${i.sizes}"` : null,
        i.type ? `type: "${i.type}"` : null,
      ].filter(Boolean);
      return `{ ${parts.join(", ")} }`;
    })
    .join(", ");

  const shortcutLines = shortcuts.map((s) => `"${s}"`).join(", ");

  return [
    "icon: [",
    iconLines,
    "],",
    `apple: [${appleLines}],`,
    `shortcut: [${shortcutLines}],`,
  ].join("\n");
}

function renderManifestIconsBlock(): string {
  const icons = buildManifestIcons();
  const iconLines = icons
    .map(
      (i) =>
        `  { src: "${i.src}", sizes: "${i.sizes}", type: "${i.type}"${
          i.purpose ? `, purpose: "${i.purpose}"` : ""
        } },`,
    )
    .join("\n");

  return ["icons: [", iconLines, "]"].join("\n");
}

async function replaceBetweenMarkers(
  filePath: string,
  start: string,
  end: string,
  block: string,
) {
  const original = await fs.readFile(filePath, "utf8");
  const startIdx = original.indexOf(start);
  const endIdx = original.indexOf(end);

  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
    console.warn(
      `Skipped ${path.relative(projectRoot, filePath)}: markers not found, no changes made.`,
    );
    return;
  }

  const lineStart = original.lastIndexOf("\n", startIdx) + 1;
  const indentMatch = original.slice(lineStart, startIdx).match(/^[ \\t]*/);
  const indent = indentMatch ? indentMatch[0] : "";

  const blockWithIndent =
    "\n" + indent + block.trim().replace(/\n/g, `\n${indent}`) + "\n";

  const updated =
    original.slice(0, startIdx + start.length) +
    blockWithIndent +
    original.slice(endIdx);

  if (updated !== original) {
    await fs.writeFile(filePath, updated, "utf8");
    console.log(`Updated ${path.relative(projectRoot, filePath)}`);
  } else {
    console.log(`No changes needed for ${path.relative(projectRoot, filePath)}`);
  }
}

async function ensureSourceImage(): Promise<void> {
  if (!existsSync(sourcePath)) {
    throw new Error(
      `Missing source image at ${path.relative(projectRoot, sourcePath)}. Add a high-res PNG before running.`,
    );
  }

  const meta = await sharp(sourcePath).metadata();
  const minDim = Math.min(meta.width ?? 0, meta.height ?? 0);
  const largestTarget = Math.max(
    ...pngTargets.map((t) => t.size),
    ...icoSizes,
  );

  if (!meta.width || !meta.height || minDim < largestTarget) {
    throw new Error(
      `Source image must be at least ${largestTarget}x${largestTarget}px. Current: ${meta.width}x${meta.height}.`,
    );
  }
}

async function generatePngTargets(): Promise<void> {
  await fs.mkdir(publicDir, { recursive: true });

  for (const target of pngTargets) {
    const buffer = await sharp(sourcePath)
      .rotate()
      .resize(target.size, target.size, { fit: "cover" })
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toBuffer();

    await fs.writeFile(path.join(publicDir, target.file), buffer);
    console.log(`Wrote ${target.file}`);
  }
}

async function generateFaviconIco(): Promise<void> {
  const pngToIco: PngToIco = (await import("png-to-ico")).default as PngToIco;

  const buffers: Buffer[] = [];
  for (const size of icoSizes) {
    const buf = await sharp(sourcePath)
      .rotate()
      .resize(size, size, { fit: "cover" })
      .png()
      .toBuffer();
    buffers.push(buf);
  }

  const ico = await pngToIco(buffers);
  await fs.writeFile(path.join(publicDir, "favicon.ico"), ico);
  console.log("Wrote favicon.ico");
}

async function main() {
  console.log("Starting favicon generation...");
  await ensureSourceImage();
  await generatePngTargets();
  await generateFaviconIco();

  await replaceBetweenMarkers(
    layoutFile,
    markerStart,
    markerEnd,
    renderLayoutIconsBlock(),
  );

  await replaceBetweenMarkers(
    manifestFile,
    markerStart,
    markerEnd,
    renderManifestIconsBlock(),
  );

  console.log("Done. Remember to commit updated assets and metadata.");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

