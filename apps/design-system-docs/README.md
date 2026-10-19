# EDS Documentation Website

The public Equinor Design System documentation site — [eds.equinor.com](https://eds.equinor.com) — built with [Docusaurus](https://docusaurus.io/).

It is versioned. `docs/` is the current version, labelled **3.0.0-beta** and served at `/docs/Next/…`. `versioned_docs/version-2.0.0-beta/` is a frozen snapshot served at `/docs/2.0.0-beta/…`, rendered with the redesign. `versioned_docs/version-1.1.0/` is a **frozen archive** served at `/docs/…` that must not be restyled or edited.

## Conventions

**[`AGENTS.md`](./AGENTS.md) is the canonical reference for this app** — directory map, the five global stylesheets, the two token bundles and their typography collision, the Inter subset rule, version scoping, the shared MDX component registry, StoryCanvas, the webpack aliases, which dependencies this app may declare, and the full verification workflow. Read it before changing anything here; this README only covers getting the site running.

Repo-wide conventions (commits, secrets, formatting) are in the root [`AGENTS.md`](../../AGENTS.md).

## Prerequisites

- **Node.js** — the version in [`.nvmrc`](../../.nvmrc) (`nvm use` from the repo root). Note the production image pins its own version in `DockerfileEdsDocs`.
- **pnpm** — the version in the root `package.json` `packageManager` field.

## Setup

This app is part of the EDS monorepo, and **all commands run from the repo root**, not from this directory.

```bash
pnpm install
pnpm run build          # required — see below
```

`pnpm run build` is not optional. The site resolves `@equinor/eds-core-react/next` and `/next/index.css` through webpack aliases that point straight at eds-core-react's **built** artifacts (`/next` is deliberately absent from the committed `exports` map — beta-only, issue #4395). Without that build the site fails to compile, or components silently go missing.

If components disappear after a change to eds-core-react, rebuild in order:

```bash
pnpm --filter @equinor/eds-utils run build
pnpm run build:core-react
```

## Commands

Run from the repo root.

| Command                       | What it does                                                     |
| ----------------------------- | ---------------------------------------------------------------- |
| `pnpm docu:start`             | Dev server on `http://localhost:3000`, with hot reload            |
| `pnpm docu:build`             | Extract prerequisites, then build the static site into `build/`   |
| `pnpm docu:serve`             | Serve the built site locally (add `--port N` to avoid a clash)    |
| `pnpm docu:clear`             | Clear the Docusaurus cache                                        |
| `pnpm run build:docs`         | Build only — what CI and `DockerfileEdsDocs` run                  |

Webpack/config changes need a dev-server restart; content and CSS hot-reload.

### Checks

CI splits these across three jobs in `.github/workflows/checks.yaml`: `docs` runs `format:check:docs`, `lint:css:docs`, `check:docs-stories` and `build:docs`; `tsc` runs in `types`; `lint:docs` runs in `lint` via `lint:all`. The root `pnpm run build` does **not** include this app, which is why the `docs` job exists.

| Command                        | What it checks                                        |
| ------------------------------ | ----------------------------------------------------- |
| `pnpm run types`               | Type-checks every package, this app included          |
| `pnpm run lint:docs`           | ESLint                                                |
| `pnpm run lint:css:docs`       | Stylelint                                             |
| `pnpm run format:check:docs`   | Prettier (excludes the frozen 1.1.0 archive)          |
| `pnpm run check:docs-stories`  | Every StoryCanvas / StorybookEmbed reference resolves |
| `pnpm --filter design-system-docs run check:colour-docs` | The colour pages and components match the token source |

Two checks need a running server and are not in CI — the viewport-overflow gate (`node scripts/check-viewport-overflow.mjs [baseUrl]`) and a manual light/dark browser pass. See the verification workflow in [`AGENTS.md`](./AGENTS.md#verification-workflow).

## Writing documentation

Content lives in `docs/` as Markdown and MDX. For tone of voice, section order and the component-doc template, see [`COMPONENT_DOC_STYLE.md`](../../documentation/agent-instructions/COMPONENT_DOC_STYLE.md).

Three tone guides live in [`documentation/agent-instructions/tone-guide/`](../../documentation/agent-instructions/tone-guide/index.md):

- [Friendly Professional](../../documentation/agent-instructions/tone-guide/friendly-professional.md): the default
- [Friendly Minimalist Blend](../../documentation/agent-instructions/tone-guide/friendly-minimalist-blend.md): concise but approachable
- [Minimalist](../../documentation/agent-instructions/tone-guide/minimalist.md): essential information only

Unwritten component docs are parked as `_name.md`. Docusaurus skips `_`-prefixed files, so they stay out of the build, the sidebar and the search index; drop the underscore, add a `description`, and add the doc id to `componentsSidebar` in `sidebars.ts` to publish one.

## Colour docs generation

The colour foundation docs are partly generated. Two scripts in `scripts/` keep them true to the
token source, and both read only from `packages/eds-tokens/src/tokens` - no external service, no
authentication, no separate export step.

```bash
pnpm --filter design-system-docs run generate:colour-reference   # rewrite the reference table
pnpm --filter design-system-docs run check:colour-docs           # verify the pages and components against the tokens
```

Run the generator after any token release, and the checker before opening a PR that touches the
colour docs.

### What is generated, and what is not

| | |
|---|---|
| **Generated** | `docs/foundation/colour/reference.mdx`, the region between the `GENERATED` markers: 263 tokens in 9 groups, each with its CSS custom property and its resolved light and dark values |
| **Hand-written** | everything else. All prose on `intro`, `getting_started`, `usage`, `palette` and `migration`, and the frontmatter and introduction above the markers on `reference` |

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

### The three name forms

A colour token is written three ways, and the docs cover all of them:

| Where | How it is written |
|---|---|
| Figma | `background.non-interactive.accent.muted` |
| CSS | `--eds-background-non-interactive-accent-muted` |
| TypeScript | `semantic.background.nonInteractive.accent.muted` |

The reference table carries the first two. The TypeScript form is documented as a rule rather than a
column, because a fourth column made the table unreadable and the rule holds for all 263 colour
tokens. `check:colour-docs` asserts that: it flattens the generated `ts/semantic/light.ts` and
verifies every canonical name camel-cases to a path that actually exists, so the documented rule
cannot quietly become false.

### What the checker catches

Docusaurus catches none of this: a mistyped custom property renders as an unstyled element, and a
stale count renders as a smaller grid. Neither raises an error.

- a dotted token name in prose that does not exist
- a `--eds-*` property that does not exist, in prose or in a component
- a structural count in a component that no longer matches the token source
- a colour token whose TypeScript path no longer follows the documented camel-case rule
- banned wording in prose: em-dashes, "real", "land", "ladder", "rung", "load-bearing"

2.x names are accepted where the migration page quotes them deliberately, read from the legacy build
rather than allowed by prefix, so a typo in a legacy name still fails.

## Troubleshooting

**Components missing or the build fails on `@equinor/eds-core-react/next`** — eds-core-react is not built. See [Setup](#setup).

**Port 3000 in use** — Docusaurus offers the next free port. For `docu:serve`, pass `--port` explicitly.

**Stale or strange build output** — `pnpm docu:clear`, then rebuild.

**Module not found** — `pnpm install` from the root.

## Help

- Main [project README](../../README.md)
- [Docusaurus documentation](https://docusaurus.io/docs)
- Slack: [#eds-design-system](https://equinor.slack.com/archives/CJT20H1B9)
