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

## Directory map

```
docs/                      current-version content (md/mdx)
versioned_docs/1.1.0/      frozen archive — do not touch
src/css/                   the four global stylesheets (see below)
src/components/            shared site components (docs- prefixed CSS)
src/theme/                 Docusaurus swizzles + MDXComponents registry
src/pages/                 unversioned React pages (index, foundation, …)
src/clientModules/         syncColorScheme (data-theme → data-color-scheme)
scripts/                   check-viewport-overflow.mjs regression gate
sidebars.ts                hand-maintained; category link docs must NOT be
                           repeated in their own items array
docusaurus.config.ts       aliases + webpack rules (see Config)
```

## Global CSS — four files, strict responsibilities

| File                          | Owns                                                                                                                         |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `src/css/theme-variables.css` | token/font imports, every `--ifm-*` override, the site typography scale. Variables only — no element rules.                  |
| `src/css/docs-components.css` | the `--docs-*` design variables (typography roles, rhythm, gutter, breakpoint convention) + tiny utilities (`.docs-section`) |
| `src/css/site-chrome.css`     | navbar, sidebar, TOC, breadcrumbs, footer rules                                                                              |
| `src/css/doc-layouts.css`     | doc-page layouts: default card, `.docs-landing` breakout, component-doc hero chrome, foundation full-width block             |

Component styling is colocated (`src/components/X/x.css`). Convention:
**plain CSS files, not CSS modules**, `docs-` prefixed root class, BEM-style
elements, `data-*` attributes for variants. One exception:
`src/theme/DocItem/Layout/styles.module.css` stays a module because it tracks
the upstream Docusaurus file.

## Tokens — two bundles, one collision

**RULE: site styling derives ONLY from the semantic layer of the Tokens
Studio bundle** — `--eds-background-*`, `--eds-text-*`, `--eds-border-*`,
`--eds-icon-*`, `--eds-typography-*`, `--eds-font-*`, `--eds-spacing-*`,
`--eds-corner-radius-*`. Never reference primitives (`--eds-primitives-*`,
`--eds-light-*`/`--eds-dark-*`, palette steps like `--eds-accent-9`), the
density layer (`--eds-density-*`), or legacy `--eds-color-*` names. The only
sanctioned exceptions are the two bridges, each defined in exactly one place:

- the semantic typography bridge in `theme-variables.css` (`:root:root`
  re-declarations resolving the header-* font-size collision below), and
- `--docs-elevation-low/high` in `docs-components.css` (the Tokens Studio
  bundle ships no elevation tokens yet) — components use the `--docs-*`
  names, never `--eds-elevation-*` directly.

Both token bundles load (see imports in `theme-variables.css`):

1. **Tokens Studio bundle** (ADR-0011) — the source of truth for the site's
   own colours/typography. Imported as
   `@equinor/eds-tokens/next/css/variables.css` via a webpack alias to the
   committed `packages/eds-tokens/src/tokens/css/variables.css`. Names:
   `--eds-background-*`, `--eds-text-*`, `--eds-border-*`,
   `--eds-corner-radius-*`, `--eds-typography-{ui,header}-*`,
   `--eds-font-family-*`, `--eds-font-weight-*` (max weight `bolder` = 500).
2. **Legacy bundle** (`@equinor/eds-tokens/css/variables`) — retained ONLY for
   `--eds-elevation-*`, `--eds-container-space-*`, and the embedded `/next`
   component previews, which consume legacy names. Do not use legacy
   `--eds-color-*` names in site CSS.

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
  the View-in-Storybook link from the `id` (never hand-write those links)
- `StoryCanvas` — **what every component doc uses**: renders actual CSF story
  files natively via `composeStories()` (`src/components/StoryCanvas/`).
  Registry in `stories.ts` (one namespace import + one `composeStories` entry
  per component, alphabetical); usage
  `<StoryCanvas of="Button/Default" showLink />`. No `height` — canvases
  auto-size. An unknown `of` path logs and renders nothing, so verify the
  story name against the component's `.stories.tsx` exports. Stories that
  drive their own state through Storybook's `useArgs()` render but cannot be
  interacted with here (`Switch/Introduction` is the one such case) — prefer a
  story with local `useState` when the doc needs interactivity.
- `DocsLanding` — wrapper that opts an MDX doc into the full-width landing
  layout (styled in `doc-layouts.css`)

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

## Verification workflow

1. `npx tsc --noEmit -p apps/design-system-docs`
2. `npx docusaurus build` (from this dir) — `onBrokenLinks: 'throw'` is the
   link gate. Known-acceptable warnings: two broken-anchor warnings on the
   resources page (JSX-rendered heading ids are invisible to the checker —
   verified present at runtime) and css-minimizer warnings on modern CSS
   functions (`tan(atan2())`) in compiled component source.
3. `node scripts/check-viewport-overflow.mjs` with the dev server running.
4. Browser pass in light AND dark mode. Standard regression set: `/`,
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
