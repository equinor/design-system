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

### Colour docs

```bash
pnpm generate:colour-reference
pnpm check:colour-docs
```

Regenerate the colour token reference from `packages/eds-tokens`, and verify the colour pages and
components against it. See [Colour docs generation](#colour-docs-generation).

## Project Structure

The documentation site includes:

* **docs/** -- Documentation content in Markdown and MDX format
* **src/** -- Custom React components and pages
* **static/** -- Static assets like images and files
* **docusaurus.config.ts** -- Docusaurus configuration

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

## Colour docs generation

The colour foundation docs are partly generated. Two scripts in `scripts/` keep them true to the
token source, and both read only from `packages/eds-tokens/src/tokens` - no external service, no
authentication, no separate export step.

```bash
pnpm generate:colour-reference   # rewrite the reference table
pnpm check:colour-docs           # verify the pages and components against the tokens
```

Run the generator after any token release, and the checker before opening a PR that touches the
colour docs.

### What is generated, and what is not

| | |
|---|---|
| **Generated** | `docs/foundation/colour/reference.mdx`, the region between the `GENERATED` markers: 263 tokens in 9 groups, each with its CSS custom property and its resolved light and dark values |
| **Hand-written** | everything else. All prose on `intro`, `getting_started`, `palette` and `migration`, and the frontmatter and introduction above the markers on `reference` |

Do not edit inside the markers. The next run overwrites it.

### The components sit in between

`ColourPairing`, `ColourStates`, `ColourScale`, `DataVizPalette`, `TokenAnatomy`, `MigrationMap` and
`ColourSwatch` never hard-code a colour. They emit `var(--eds-*)` and the browser resolves it, so a
token value change appears without regenerating anything. The one exception is the 1.x column in
`MigrationMap`, which is literal hex because that generation was a hand-picked palette whose
variables are not loaded here.

`TokenAnatomy` is the general one: give it a specimen and a list of annotations and it draws leader
lines from the element out to the tokens that produce it. Its geometry is fixed rather than measured,
so it renders correctly on the server where there is nothing to measure. Reach for it whenever a
worked example would otherwise be a table of part names.

What they do hold as literals is **structure**: which pairings exist, the role of each of the 15
steps, and how many data-visualisation ramps there are. Those cannot be read from a `var()`, so
`check:colour-docs` asserts them against the token source instead. If a seventh tone were added, the
pages would otherwise quietly render an incomplete picture.

### Component copy follows the same style guide

The labels and notes inside these components are documentation, so they follow
[`COMPONENT_DOC_STYLE.md`](../../documentation/agent-instructions/COMPONENT_DOC_STYLE.md) exactly as
the prose does: British English, no em-dashes, and plain language over internal vocabulary. A reader
does not know what a "consumer" is, so a step with nothing pointing at it reads as *not used*.

### Where the values come from

| Source | Used for |
|---|---|
| `dtcg/semantic/default.json` | token names, and each token's own CSS custom property, from `$extensions["com.figma"].codeSyntax.WEB` |
| `css/variables.css` | the resolved value in each colour scheme |

The CSS names are not derived from the Figma names by a transform. Both come from one definition, so
they cannot drift apart. If you need a value, look it up rather than converting one yourself.

### What the checker catches

Docusaurus catches none of this: a mistyped custom property renders as an unstyled element, and a
stale count renders as a smaller grid. Neither raises an error.

- a dotted token name in prose that does not exist
- a `--eds-*` property that does not exist, in prose or in a component
- a structural count in a component that no longer matches the token source

2.x names are accepted where the migration page quotes them deliberately, read from the legacy build
rather than allowed by prefix, so a typo in a legacy name still fails.

## Design token CSS

`src/css/custom.css` imports **two** token bundles, on purpose:

```css
@import '@equinor/eds-tokens/css/variables';                        /* 2.x */
@import '../../../../packages/eds-tokens/src/tokens/css/variables.css';  /* 3.x */
```

The first is the legacy build (603 variables, `--eds-color-*`). Most of the site still reads those
names, so it stays.

The second is the Tokens Studio output (975 variables, `--eds-background-*`, `--eds-text-on-*`, …),
which the colour foundation docs document and which the colour components paint with. Without it,
every `var(--eds-background-*)` on the site resolves to nothing.

**Why the relative path.** The package exposes the Tokens Studio output as `./next/css/*`, but that
export is injected at publish time and only on the beta dist-tag, per
[ADR-0009](../../documentation/adr/0009-temporary-next-subpaths-for-eds-tokens-beta.md). A workspace
app resolves against the checked-in `package.json`, where the specifier does not exist, so it cannot
be imported by name.

**When to remove it.** ADR-0009's exit plan is that once the last `/next` component has migrated, a
beta release drops the legacy `build/` output and moves the Tokens Studio output onto the final
specifiers. At that point both imports collapse into a single
`@import '@equinor/eds-tokens/css/variables';` and the relative path goes. Until then it will break
if the tokens package moves that file, so it is worth checking after any change to the tokens build.

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
