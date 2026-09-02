# EDS Documentation Website

The public Equinor Design System documentation site — [eds.equinor.com](https://eds.equinor.com) — built with [Docusaurus](https://docusaurus.io/).

It is versioned. `docs/` is the current version, labelled **2.0.0-beta** and served at `/docs/Next/…`; `versioned_docs/version-1.1.0/` is a **frozen archive** served at `/docs/…` that must not be restyled or edited.

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

These are the same checks CI runs in the `docs` job of `.github/workflows/checks.yaml`. The root `pnpm run build` does **not** include this app, which is why that job exists.

| Command                        | What it checks                                        |
| ------------------------------ | ----------------------------------------------------- |
| `pnpm run types`               | Type-checks every package, this app included          |
| `pnpm run lint:docs`           | ESLint                                                |
| `pnpm run lint:css:docs`       | Stylelint                                             |
| `pnpm run format:check:docs`   | Prettier (excludes the frozen 1.1.0 archive)          |
| `pnpm run check:docs-stories`  | Every StoryCanvas / StorybookEmbed reference resolves |

Two checks need a running server and are not in CI — the viewport-overflow gate (`node scripts/check-viewport-overflow.mjs [baseUrl]`) and a manual light/dark browser pass. See the verification workflow in [`AGENTS.md`](./AGENTS.md#verification-workflow).

## Writing documentation

Content lives in `docs/` as Markdown and MDX. For tone of voice, section order and the component-doc template, see [`COMPONENT_DOC_STYLE.md`](../../documentation/agent-instructions/COMPONENT_DOC_STYLE.md).

Three tone guides are available, and are excluded from the build:

- [Friendly Professional](./docs/tone-guide/friendly-professional.md) — the default
- [Friendly Minimalist Blend](./docs/tone-guide/friendly-minimalist-blend.md) — concise but approachable
- [Minimalist](./docs/tone-guide/minimalist.md) — essential information only

Unwritten component docs are parked as `_name.md`. Docusaurus skips `_`-prefixed files, so they stay out of the build, the sidebar and the search index; drop the underscore and add a `description` to publish one.

## Troubleshooting

**Components missing or the build fails on `@equinor/eds-core-react/next`** — eds-core-react is not built. See [Setup](#setup).

**Port 3000 in use** — Docusaurus offers the next free port. For `docu:serve`, pass `--port` explicitly.

**Stale or strange build output** — `pnpm docu:clear`, then rebuild.

**Module not found** — `pnpm install` from the root.

## Help

- Main [project README](../../README.md)
- [Docusaurus documentation](https://docusaurus.io/docs)
- Slack: [#eds-design-system](https://equinor.slack.com/archives/CJT20H1B9)
