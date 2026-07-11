import { defineCollections, defineConfig } from "fumadocs-mdx/config";
import { z } from "zod";

export const projects = defineCollections({
  type: "doc",
  dir: "content/projects",
  files: ["**/*.mdx"],
  schema: z.object({
    title: z.string().min(1),
    // One-line subtitle shown under the title and in list rows
    description: z.string().min(1),
    // Drives the chronological ordering (newest first)
    date: z.coerce.date(),
    // Short labels/tags, e.g. ["Minecraft", "Java", "Infrastructure"]
    labels: z.array(z.string()).min(1),
    // REQUIRED. Path under /public, e.g. "/projects/<slug>/cover.png"
    cover: z.string().min(1),
    links: z
      .object({
        github: z.string().url().optional(),
        website: z.string().url().optional(),
      })
      .default({}),
    draft: z.boolean().default(false),
  }),
});

export default defineConfig();
