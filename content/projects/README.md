# Authoring project case studies

Every project is a pair of MDX files in this directory:

- `<slug>.mdx` — the English content (default locale).
- `<slug>.fr.mdx` — the French content. **Mandatory.** The build fails if it
  is missing.

The slug is the filename (kebab-case), and it becomes the URL:
`/projects/<slug>`.

## Frontmatter fields

| Field | Type | Meaning |
|---|---|---|
| `title` | string | Project title, shown as the page `h1` and in the index. |
| `description` | string | One-line subtitle, shown under the title and in list rows. Also used as the SEO/OG description. |
| `date` | date | Drives chronological ordering (newest first) and the year grouping on the index. |
| `labels` | string[] | Short tags (e.g. `["Java", "Discord", "Bot"]`), used for the index's client-side filters. |
| `cover` | string | **Mandatory.** Absolute path under `/public`, e.g. `/projects/<slug>/cover.png`. The build fails if the file does not exist. |
| `links.github` | url | Optional GitHub repo URL. |
| `links.website` | url | Optional live site URL. |
| `draft` | boolean | Defaults to `false`. When `true`, the project is hidden in production but still requires both locale files and a cover/OG image. |

## Body conventions

- Start headings at `##` — the page renders the frontmatter `title` as the
  single `h1`.
- Every image must have meaningful alt text (accessibility requirement, not
  optional).
- Reference images by absolute path under `public/projects/<slug>/`.

## Images

- Cover: `public/projects/<slug>/cover.png` (mandatory, referenced by the
  `cover` frontmatter field).
- OG image: `public/projects/<slug>/og.png` (mandatory, generated — see
  below). The build fails if it is missing.
- Placeholder covers/OG cards are generated automatically for any project
  missing one when running `bun run og:generate`. **Replace placeholder
  covers with real imagery before publishing.**

## Workflow for adding a project

1. Create `<slug>.mdx` and `<slug>.fr.mdx` with the frontmatter above.
2. Add a cover image at `public/projects/<slug>/cover.png` (or let
   `bun run og:generate` create a placeholder).
3. Run `bun run og:generate` to (re)generate the OG image.
4. Run `bun run content:check` to validate everything before committing.
