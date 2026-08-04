# EDS Documentation Website

This documentation website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator. It provides comprehensive documentation, guidelines, and resources for the Equinor Design System.

## Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js** -- Version 16.15 or compatible
* **pnpm** -- Version 10.15.0 or higher (install globally with `npm install -g pnpm`)

## Important Note

This documentation site is part of the EDS monorepo. All commands should be run from the **root directory** of the monorepo, not from this directory.

If you haven't already, start by setting up the monorepo:
- First navigate to the root directory
- Then install dependencies and build packages by running `pnpm run init`

## Available Commands

Run these commands from the **root directory** of the monorepo:

### Local Development

```bash
pnpm docu:start
```

This command starts a local development server at `http://localhost:3000` and opens your browser. Most changes are reflected live without needing to restart the server.

### Build

```bash
pnpm docu:build
```

This command extracts prerequisites and generates static content into the `build` directory. You can serve this content using any static hosting service.

### Serve Built Site

```bash
pnpm docu:serve
```

Use this command to preview the production build locally before deploying.

### Clear Cache

```bash
pnpm docu:clear
```

If you encounter issues, clear the Docusaurus cache with this command.

### Extract Prerequisites

```bash
pnpm docu:prerequisites
```

This command extracts prerequisite information from package files. It runs automatically during the build process.

### Lint

```bash
pnpm lint:docs
```

Run ESLint to check for code quality issues in the documentation site.

## Project Structure

The documentation site includes:

* **docs/** -- Documentation content in Markdown and MDX format
* **src/** -- Custom React components and pages
* **static/** -- Static assets like images and files
* **docusaurus.config.ts** -- Docusaurus configuration

## Page Layouts

The site has three layouts. Pick one when adding a page -- do not invent a fourth.

| Layout | How a page opts in | Used by |
| --- | --- | --- |
| **Landing** | React pages: `@theme/Layout`. MDX docs: wrap the content in `<DocsLanding>` with frontmatter `hide_table_of_contents: true` + `displayed_sidebar: null`. | `/`, `/foundation`, `/getting-started`, `/about`, `components.mdx`, `resources.mdx`, `support.mdx`, and the getting-started guides |
| **Component doc** | Frontmatter `hide_title: true` + `description:`, no in-body `# Title`. | `docs/components/**/*.md` |
| **Foundation doc** | Automatic for any page under `docs/foundation/`. | `docs/foundation/**` |

Shared building blocks (`Hero`, `SectionHeading`, `IconCard`/`IconCardGrid`,
`CtaSection`, `TeamCard`, `Icon`, `StorybookEmbed`, `Tabs`, `TabItem`) are
registered globally in `src/theme/MDXComponents.tsx`, so MDX files use them
without imports. Repeated content (team, foundation nav, getting-started paths,
Slack URL) lives in `src/data/`.

**Landing** pages compose `<Hero>` + `<section className="docs-section">` +
`<SectionHeading>` + cards. `<SectionHeading>` emits a slugified `id` from its
`title`, so sections are deep-linkable the same way markdown headings are.
Docusaurus's broken-anchor check only reads markdown headings, so it reports
these anchors as broken even though they resolve at runtime.

**Component docs** render a full-width hero band (title + `description`) above
the standard three-column body via the `src/theme/DocItem/Layout` swizzle. The
`description` frontmatter doubles as the SEO meta description, and `hide_title`
keeps exactly one `<h1>` on the page. Unwritten component docs are parked as
`_name.md` -- Docusaurus skips `_`-prefixed files, so they stay out of the
build, the sidebar and the search index until someone writes them. Drop the
underscore and add a `description` to publish one.

**Foundation docs** get a full-bleed hero from the first heading with the
sidebar and TOC hidden, driven by `docs-doc-id-foundation/` styling in
`custom.css`. That styling is scoped to `docs-version-current`; archived
versions keep the stock Docusaurus layout.

For colours and surfaces, use **Infima variables** (`--ifm-*`) for neutral
backgrounds and text -- they flip in dark mode. EDS `--eds-*` tokens are correct
for accent and brand, but EDS *neutral* tokens resolve to their light value
regardless of colour scheme in this app.

## Writing Documentation

When adding or updating documentation:

1. Create or edit Markdown/MDX files in the `docs/` directory
2. Use clear headings and structure for easy navigation
3. Test your changes locally with `pnpm docu:start`
4. Ensure all links work correctly

## Writing Tone Guides

When creating content for the documentation site, choose the appropriate tone guide:

* [Friendly Professional](./docs/tone-guide/friendly-professional.md) -- Default for most documentation
* [Friendly Minimalist Blend](./docs/tone-guide/friendly-minimalist-blend.md) -- Concise but approachable
* [Minimalist](./docs/tone-guide/minimalist.md) -- Essential information only

## Technology Stack

The documentation site uses:

* **Docusaurus** -- Static site generator
* **React** -- UI framework
* **TypeScript** -- Type-safe JavaScript
* **MDX** -- Markdown with React components
* **EDS Tokens & Components** -- Equinor Design System packages

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, either stop the conflicting process or Docusaurus will automatically use the next available port.

### Build Fails

Try clearing the cache, rebuilding and then restarting:

```bash
pnpm docu:clear
pnpm docu:build
pnpm docu:start
```

### Module Not Found Errors

Ensure all dependencies are installed by running from the root:

```bash
pnpm install
```

## Contributing

When contributing to the documentation:

1. Follow the [contribution guidelines](../../README.md#contributions)
2. Use the appropriate [tone guide](#writing-tone-guides) for your content
3. Test locally before submitting a pull request
4. Ensure all links and images work correctly

## Need Help?

* Check the main [project README](../../README.md) for more information about the monorepo
* Visit the [Docusaurus documentation](https://docusaurus.io/docs) for site-specific questions
* Join the conversation on Slack: [#eds-design-system](https://equinor.slack.com/archives/CJT20H1B9)
