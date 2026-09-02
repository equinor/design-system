# AGENTS.md — EDS Documentation Site

Conventions for AI agents working in `apps/design-system-docs` — the public
EDS documentation site (eds.equinor.com), built with **Docusaurus 3.10**.
Repo-wide conventions (commits, secrets, formatting, component code style)
live in the root [`AGENTS.md`](../../AGENTS.md); this file covers only what is
specific to this app.

## What this app is

A versioned Docusaurus site documenting EDS 2.0. Two doc versions exist:

| Version                             | Content dir                     | URL path                                            | Status                                                   |
| ----------------------------------- | ------------------------------- | --------------------------------------------------- | -------------------------------------------------------- |
| `current` (labelled **2.0.0-beta**) | `docs/`                         | `/docs/Next/…` (capital N, baked into footer links) | the active redesign                                      |
| `1.1.0`                             | `versioned_docs/version-1.1.0/` | `/docs/…`                                           | **frozen archive — never restyle or edit its rendering** |

**Version scoping is the #1 footgun.** Anything that styles doc _content_
must be scoped so 1.1.0 keeps its stock rendering:

- CSS: pair `html[class*='docs-version-current']` (current docs) with
  `html:not([class*='docs-version-'])` (unversioned pages — landing,
  /foundation, /getting-started, /about). Per-element rules use
  `html:where(…)` to keep specificity at 0,0,2 so single-class component
  rules still win.
- React: the DocItem hero gate checks `metadata.version === 'current'`.
- Chrome (navbar, sidebar, TOC, footer) is deliberately version-independent.

**Both version paths are pinned explicitly, and both must stay that way.**
`docusaurus.config.ts` sets `lastVersion: 'current'` plus
`'1.1.0': { path: '' }`. Neither is decoration:

- Without `lastVersion`, Docusaurus defaults it to the newest entry in
  `versions.json` (`1.1.0`), which silently makes the frozen archive the target
  of every `type: 'docSidebar'` navbar item and of the version dropdown — while
  the footer and landing pages link to `/docs/Next/…`. The site then
  contradicts its own chrome and the redesign is unreachable from the primary
  navigation.
- With `lastVersion: 'current'`, a non-last version takes its version _name_ as
  its path, so `'1.1.0': { path: '' }` is what keeps the archive at `/docs/…`
  instead of relocating it to `/docs/1.1.0/…` and breaking every existing link.

Consequence to know about: the archive now carries Docusaurus's standard
"no longer actively maintained" banner, because it genuinely is not the latest
version. That is the one sanctioned change to its rendering; suppress with
`banner: 'none'` on the `1.1.0` entry if it is ever unwanted.

## Directory map

```
docs/                      current-version content (md/mdx)
versioned_docs/1.1.0/      frozen archive — do not touch
src/css/                   the five global stylesheets (see below)
src/components/            shared site components (docs- prefixed CSS)
src/theme/                 Docusaurus swizzles + MDXComponents registry
src/pages/                 unversioned React pages (index, foundation, …)
src/clientModules/         syncColorScheme (data-theme → data-color-scheme),
                           pageTransitions (View Transitions on route change)
scripts/                   check-viewport-overflow.mjs (needs a running
                           server) and check-story-references.mjs (static)
sidebars.ts                hand-maintained; category link docs must NOT be
                           repeated in their own items array
docusaurus.config.ts       aliases + webpack rules (see Config)
```

## Global CSS — five files, strict responsibilities

| File                           | Owns                                                                                                                                         |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/css/theme-variables.css`  | token/font imports, every `--ifm-*` override, the site typography scale. Variables, with one deliberate exception (below).                   |
| `src/css/docs-components.css`  | the `--docs-*` design variables (typography roles, rhythm, gutter, breakpoint convention) + tiny utilities (`.docs-section`)                 |
| `src/css/site-chrome.css`      | navbar, sidebar, TOC, breadcrumbs, footer rules                                                                                              |
| `src/css/doc-layouts.css`      | doc-page layouts: default card, `.docs-landing` breakout, component-doc hero chrome, foundation full-width block                             |
| `src/css/page-transitions.css` | route-change cross-fade tuning (View Transitions pseudos + chrome `view-transition-name`s); driven by `src/clientModules/pageTransitions.ts` |

The exception in `theme-variables.css`: the per-level heading line-heights at
the end of the file set `line-height` on `h1`–`h6` directly, not through a
variable. Infima has only one shared `--ifm-heading-line-height` while the
token scale ships an absolute value per level, so there is no variable to
override. They use `html:where(…)` to stay at specificity 0,0,2 so single-class
component rules still win. Everything else in the file is variables.

Component styling is colocated (`src/components/X/x.css`). Convention:
**plain CSS files, not CSS modules**, `docs-` prefixed root class, BEM-style
elements, `data-*` attributes for variants. One exception:
`src/theme/DocItem/Layout/styles.module.css` stays a module because it tracks
the upstream Docusaurus file.

Two stylelint rules are switched off for this app in `.stylelintrc.yaml`:
`selector-class-pattern` (the site must select Infima/Docusaurus classes it
does not own) and `no-descending-specificity` (the version-scoping strategy
above deliberately relies on specificity order). Every other rule applies —
`pnpm run lint:css:docs`.

## Tokens — two bundles, one collision

**RULE: site styling derives ONLY from the semantic layer of the Tokens
Studio bundle** — `--eds-background-*`, `--eds-text-*`, `--eds-border-*`,
`--eds-icon-*`, `--eds-typography-*`, `--eds-font-*`, `--eds-spacing-*`,
`--eds-corner-radius-*`, `--eds-elevation-*`. Never reference primitives
(`--eds-primitives-*`, `--eds-light-*`/`--eds-dark-*`, palette steps like
`--eds-accent-9`), the density layer (`--eds-density-*`), or legacy
`--eds-color-*` names. There is one sanctioned exception: the semantic
typography bridge in `theme-variables.css` (`:root:root` re-declarations
resolving the header-* font-size collision below).

**Elevation is a composite token — use it as one.** `--eds-elevation-low` and
`--eds-elevation-high` are `boxShadow` composites in the Tokens Studio
semantic layer, each already composed into a full two-layer (key + ambient)
`box-shadow` value. Consume those two names directly. Do not compose a shadow
from the `--eds-shadow-{low,high}-{key,ambient}-{x,y,blur,spread,color}` parts
they are built from — those are the composite's internals, and restating the
composition in site CSS silently goes stale if a layer is ever added.

Both token bundles load (see imports in `theme-variables.css`):

1. **Tokens Studio bundle** (ADR-0011) — the source of truth for the site's
   own colours, typography and elevation. Imported as
   `@equinor/eds-tokens/next/css/variables.css` via a webpack alias to the
   committed `packages/eds-tokens/src/tokens/css/variables.css`. Names:
   `--eds-background-*`, `--eds-text-*`, `--eds-border-*`,
   `--eds-corner-radius-*`, `--eds-typography-{ui,header}-*`,
   `--eds-font-family-*`, `--eds-font-weight-*` (max weight `bolder` = 500),
   `--eds-elevation-{low,high}`.
2. **Legacy bundle** (`@equinor/eds-tokens/css/variables`) — retained ONLY for
   `--eds-container-space-*` and the embedded `/next` component previews,
   which consume legacy names. Do not use legacy `--eds-color-*` names in
   site CSS. **It must stay the first of the two imports:** it also declares
   `--eds-elevation-low/high`, at the same specificity as the Tokens Studio
   pair (both 0,1,0), so import order is the only thing making the Tokens
   Studio composite win. The values agree today, so a reordering would not
   show up visually — it would just silently pin the site to the legacy flat
   shadow, which does not flip with the colour scheme.

## Fonts

Equinor comes from the CDN (`cdn.eds.equinor.com`); Inter is self-hosted via
`@fontsource/inter`, imported in `theme-variables.css`.

**Import the `latin-NNN.css` entrypoints, never the unsuffixed `NNN.css`.**
The unsuffixed ones pull seven subsets each (latin, latin-ext, cyrillic,
cyrillic-ext, greek, greek-ext, vietnamese). The site is `locales: ['en']`, and
the six extra subsets cost more than their file size: their smaller `.woff2`
files fall under Docusaurus's asset-inlining threshold, so they get base64'd
straight into the render-blocking stylesheet. Measured, that was 31 inlined
blobs and 28 `@font-face` rules, and it held the global sheet at 279.9 kB gzip
compressing at only 2.2:1. Latin-only: 4 rules, no base64, **47.7 kB gzip**.

Safe because every non-ASCII character in `docs/` and `src/` is inside the
latin subset's `unicode-range`. The ones that are not — arrows, `≈`, `≥`, `⌘`,
emoji — are absent from _all_ of Inter's subsets, so they render from a
fallback font either way.

Weights 400, 500, 600 and 700 are all loaded. 400 and 500 are the site's own
(`--docs-font-weight-emphasis` is `bolder` = 500); 600 and 700 back Infima's
`--ifm-font-weight-{semibold,bold}`, and `<strong>` really does compute to 700.
Do not trim to 400+500 on the strength of the "never 600/700" rule in the root
AGENTS.md — that rule is about EDS component CSS, and dropping them here would
lighten every bold run of prose on the site.

**Collision gotcha:** both bundles define `--eds-typography-header-*-font-size`
with different values, and webpack CSS ordering lets the legacy bundle win.
The semantic typography bridge in `theme-variables.css` (`:root:root`
specificity 0,2,0) pins the semantic names to the Tokens Studio values, so
site CSS consumes the semantic `--eds-typography-header-*` names normally.
Do not remove the bridge and do not reference `--eds-density-*` directly.

Dark mode: `src/clientModules/syncColorScheme.ts` mirrors Docusaurus's
`data-theme` to `data-color-scheme` on `<html>`, which is what both token
bundles key on. New colours must come from tokens so they flip automatically.

## Typography — one scale, defined once

`docs-components.css` defines the `--docs-font-*` roles; everything consumes
them. Never hardcode font sizes/weights/line-heights in component CSS.

| Role              | Variable                                             | Token (desktop)                                                                    |
| ----------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Display (heroes)  | `--docs-font-display-*`                              | site-local 44px/1.15 (above the token scale); steps to `header-4xl` 32px on phones |
| h1 markdown       | `--ifm-h1-font-size`                                 | `header-4xl` 32px                                                                  |
| h2 / sections     | `--docs-font-section-*`                              | `header-3xl` 24/32                                                                 |
| h3 / sub-sections | `--docs-font-subsection-*`                           | `header-xl` 21/24                                                                  |
| Card titles / h4  | `--docs-font-card-title-*`                           | `header-lg` 18/24                                                                  |
| Lead paragraphs   | `--docs-font-lead-size`                              | `ui-xl` 18px                                                                       |
| Body prose        | `--docs-font-body-size` + `--docs-prose-line-height` | `ui-lg` 16px, lh 1.6 (site-local)                                                  |
| Secondary text    | `--docs-font-body-sm-*`                              | `ui-md` 14/20                                                                      |
| Captions/badges   | `--docs-font-caption-*`                              | `ui-sm` 12/16                                                                      |
| Emphasis weight   | `--docs-font-weight-emphasis`                        | `bolder` = 500 (never 600/700)                                                     |

Docusaurus re-declares heading size vars **on the markdown heading elements**
(`.markdown h1:first-child`, `.markdown > h2/h3`), so overrides must be
restated at those exact scopes — see `theme-variables.css`.

## Responsive rules

- Exactly **two breakpoints**: `996px` (Infima's layout flip) and `600px`
  (phone). Documented in `docs-components.css`; don't add others.
- Phone adjustments live in ONE `@media (max-width: 600px)` block overriding
  the `--docs-*` variables — not per component.
- Grids prefer `repeat(auto-fill|auto-fit, minmax(…))` over breakpoint
  columns (footer, entry/resource grids, gallery, team grid all do this).
- Regression gate: `node scripts/check-viewport-overflow.mjs` (dev server
  running) asserts no horizontal scroll on 8 key pages × 375/768/1440px.
  Run it after any layout change.

## Shared components (registered globally in `src/theme/MDXComponents.tsx`)

MDX docs use these without imports; React pages import them from
`@site/src/components/*`.

- `DocsSection` — section + container + SectionHeading boilerplate
  (`title`, `subtitle`, `tone="muted"`, `as`, `id`)
- `Hero`, `SectionHeading`, `IconCard`/`IconCardGrid`, `CtaSection`,
  `TeamCard`, `Icon` — landing-page building blocks
- `GalleryCard`/`GalleryGrid` — live-preview cards on `/components`
  (previews import real components from `@equinor/eds-core-react/next`)
- `StorybookEmbed` — iframe of the deployed Storybook; `showLink` derives
  the View-in-Storybook link from the `id` (never hand-write those links).
  Now only used for Foundation stories that have no registry entry
  (`foundation/design-tokens/typography.md`); component docs use StoryCanvas.
- `StoryCanvas` — **what every component doc uses**: renders actual CSF story
  files natively via `composeStories()` (`src/components/StoryCanvas/`).
  Registry in `stories.ts` (one namespace import + one `composeStories` entry
  per component, alphabetical); usage
  `<StoryCanvas of="Button/Default" showLink />`. No `height` — canvases
  auto-size. Stories that drive their own state through Storybook's `useArgs()`
  render but cannot be interacted with here (`Switch/Introduction` is the one
  such case) — prefer a story with local `useState` when the doc needs
  interactivity.

Both reference styles fail **silently** at runtime — an unknown StoryCanvas
`of` logs to the console and renders nothing, and a wrong StorybookEmbed `id`
renders Storybook's error frame inside the iframe, which the Docusaurus build
never sees. `pnpm run check:docs-stories`
(`scripts/check-story-references.mjs`) is the gate: it resolves every `of`
against the registry and the story file's real exports, and every `id` against
ids derived with Storybook's own `toId`/`storyNameFromExport`, so it cannot
drift from how Storybook slugifies a title. It runs in CI. Note that the
registry itself gives no such guarantee — `of` is a plain `string`.

- `DocsLanding` — wrapper that opts an MDX doc into the full-width landing
  layout (styled in `doc-layouts.css`)
- `DotField` — the EDS dot grid for hero bands: 2px dots on an 18px pitch plus
  a pointer-following spotlight that both brightens and enlarges the dots it
  passes over. Render it as a child of the band and add
  `docs-dot-host` to the band, which becomes its positioning context and drives
  the hover. `Hero` wires this up behind its `dots` prop; the component-doc hero
  band does it directly in the `DocItem/Layout` swizzle. Bands that come from
  markdown and cannot host an element set
  `background-image: var(--docs-dot-grid)` instead (resting grid, no
  spotlight) — the foundation hero band in `doc-layouts.css` is the one case.
  All the geometry lives in `--docs-dot-*` in `docs-components.css`; the three
  gradients resolve at `:root`, so overriding `--docs-dot-size` per band has no
  effect by design. The size falloff is two stacked lit layers (`::before` at
  `--docs-dot-size-lit` over the whole radius, `::after` at
  `--docs-dot-size-lit-near` over `--docs-dot-spotlight-core` of it) because a
  background tile has a single size for the entire layer — one layer cannot
  scale its dots by distance.

New site components follow the root AGENTS.md recipe transposed to `docs-`
prefixes; no default exports (Docusaurus swizzles and `Prerequisites` are the
grandfathered exceptions — `Prerequisites` keeps its default export because
the 1.1.0 archive imports it).

## Swizzled theme components (`src/theme/`)

- `DocItem/Layout` — eject tracking upstream 3.10.2 verbatim + the
  component-doc hero band (gated on `hide_title` + `components/` id +
  current version). Re-diff against upstream on Docusaurus upgrades.
- `Footer` — full custom footer; styled via Infima `footer__*` classes in
  `site-chrome.css`.
- `MDXComponents` — the global registry (wrap).
- `Root` — capture-phase click interceptor that runs internal navigations
  inside a View Transition (`src/utils/pageTransitions.ts` holds the shared
  state; the `pageTransitions` client module settles it on route commit).
- `SearchBar` — wrapper div (`.docs-search-bar`) giving a stable styling
  scope over the search-local plugin; selectors mirror plugin DOM and may
  need adjusting on plugin upgrades.

## Config (`docusaurus.config.ts`)

The `eds-resolver` webpack plugin holds all aliases — trailing `$` means
exact-match so subpath imports still resolve through package `exports`:

- `@equinor/eds-core-react/next$` → built dist (`/next` is deliberately NOT
  in the committed exports map — beta-only, issue #4395). **Requires
  eds-core-react to be built**; if components are missing, rebuild in order:
  `pnpm --filter @equinor/eds-utils run build` → `pnpm run build:core-react`.
- `@equinor/eds-tokens/next/css/variables.css$` → committed Tokens Studio
  bundle.
- `@eds-core-react-src` → `packages/eds-core-react/src` (portable stories).
  Mirrored in `tsconfig.json` `paths` — note `paths` REPLACES the inherited
  `@site/*` mapping, so it is restated there; never remove it. Also listed in
  the root `eslint.config.mjs` `import/no-unresolved` ignore list for this app,
  because the shared import resolver only covers `packages/*`.
- `@storybook/addon-docs/blocks$` → `src/stubs/storybook-addon-docs-blocks.tsx`.
  Story files import `Stack` from `packages/eds-core-react/.storybook/components`,
  whose barrel also re-exports helpers built on Storybook's docs blocks; those
  need a docs context that does not exist here. The stub keeps them inert.
- Module rules: babel-compiles `packages/eds-core-react/src` **and its
  `.storybook` helpers** with `@docusaurus/babel/preset`, and stubs
  `*.docs.mdx` imports inside story files as `asset/source` (Storybook MDX is
  not Docusaurus-compilable).

`tsconfig.json` also pulls in
`packages/eds-core-react/src/components/styled.d.ts`: portable stories reach
legacy components that read token values off styled-components'
`DefaultTheme`, and without that augmentation every `theme.entities.…` access
is a type error in this project.

Webpack config changes require a dev-server restart; content and CSS
hot-reload.

### Dependencies

Only declare what **this app's own source** imports. Portable stories drag
`styled-components`, `react-hook-form`, `@storybook/react-vite` and
`storybook/{actions,preview-api}` into the bundle, but those are imported by
story files inside `packages/eds-core-react`, so webpack resolves them from
that package's `node_modules`, where eds-core-react declares them. They are
correctly absent from this manifest; adding them only lets two declarations
drift apart.

`@storybook/react` is the exception and belongs in `dependencies`, not
`devDependencies`: `StoryCanvas/stories.ts` imports `composeStories` from it, so
it ships in the production bundle. Its required peer `storybook` sits alongside
it.

**Keep both ranges equal to eds-core-react's Storybook version — the exact
version, not just the major.** Nothing enforces this, and a patch-level gap is
enough to break the model: when a Dependabot bump moved eds-core-react to
`^10.5.10` while this app stayed on `^10.5.7`, pnpm installed both, so
`composeStories` resolved from one copy while the story files'
`storybook/preview-api` resolved from another. Portable stories still rendered,
but that is the shape of the failure to watch for — anything relying on
Storybook's preview singleton (decorators, `useArgs`) is where it would surface.
When eds-core-react's Storybook moves, move these two with it.

## Verification workflow

CI runs 1–5 in the `docs` job of `.github/workflows/checks.yaml`. Note that the
root `pnpm run build` does **not** build this app, which is why that job exists
and why it `needs: build` — the webpack aliases point at eds-core-react's built
artifacts.

1. `npx tsc --noEmit -p apps/design-system-docs`
2. `pnpm run format:check:docs` — scoped to `{src,docs,scripts}` plus the app's
   root files. `versioned_docs/version-1.1.0/` is deliberately excluded: 25 of
   its files are Prettier-unclean and the archive is frozen, so the gate would
   otherwise demand edits nobody is allowed to make.
3. `pnpm run lint:css:docs` and `pnpm run lint:docs`
4. `pnpm run check:docs-stories` — StoryCanvas / StorybookEmbed references.
5. `pnpm run build:docs` — `onBrokenLinks: 'throw'` is the link gate.
   Known-acceptable warnings: two broken anchors on the **photography** pages
   (`foundation/assets/photography` links to the resources page). The
   current-version one is a false positive — `SectionHeading` slugifies its
   `title`, so `#external-references` does resolve at runtime, invisibly to the
   checker. The 1.1.0 one is a **real** broken link (`#external-resources` vs
   the archive's `#external-references`), left unfixed because the archive is
   frozen. Also css-minimizer warnings on modern CSS functions
   (`tan(atan2())`) in compiled component source.

Not in CI (both need a running server):

6. `node scripts/check-viewport-overflow.mjs [baseUrl]` — 8 pages ×
   375/768/1440px. Serve the build on a spare port (`npx docusaurus serve
--port 3100`) rather than assuming 3000 is free; the dev server usually has
   it.
7. Browser pass in light AND dark mode. Standard regression set: `/`,
   `/foundation`, `/getting-started`, `/about`, `/docs/Next/components`,
   `/docs/Next/components/inputs/button`,
   `/docs/Next/foundation/accessibility`, and
   `/docs/components/inputs/button` (1.1.0 — must not change).

## Content conventions

- Doc writing style: `documentation/agent-instructions/COMPONENT_DOC_STYLE.md`
  (British English, no em-dashes, section order).
- Component reference docs use frontmatter `hide_title: true` +
  `description` — the swizzled DocItem hero renders both.
- Foundation doc pages get their full-width hero from their first `# h1` and
  first paragraph via CSS (`doc-layouts.css`) — no frontmatter mechanism.
- Never hand-write Storybook URLs in content; use `showLink` /
  `StoryCanvas`.
