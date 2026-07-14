# Docs site redesign — consolidation & hardening

Summary of the work done on the `docs/redesign-2.0.0-beta` documentation-site
redesign. The redesign looked right but was structurally unsound (heavy
copy-paste, multiple sources of truth, a bloated `custom.css`, brittle DOM-hack
client modules, several correctness bugs). This pass turned it into a
maintainable project on one shared system, done in phases.

> Nothing here was committed — all changes sit in the working tree for review.

## Starting point

- Resolved a `pnpm-lock.yaml` conflict during the branch rebase.
- Reviewed the whole redesign diff (+4975 / −868 across 81 files) and planned a
  5-phase consolidation.

---

## Phase 0 — Bugs & config hygiene

- `sidebars.ts`: removed a duplicate **"Inputs"** category (rendered twice).
- `docusaurus.config.ts`:
  - `editUrl` pointed at `/shared` (every "Edit this page" 404'd) → docs root.
  - `copyright` → `© Equinor {year}` (added ©, dropped trailing space).
  - Simplified a no-op `exclude` ternary.
  - Migrated the deprecated `onBrokenMarkdownLinks` to `markdown.hooks.*`.
- `support.mdx`: fixed a broken Slack URL (`archives/C01S2B tried`).
- `accessibility.md`: raw `class=` → `className=` (React warnings).
- Deleted `about_eds.mdx` (orphan duplicate of `/about`); documented the
  intentional `getting_started.mdx` `<Redirect>`.
- The 46-line component docs are intentional placeholder stubs, not orphans.

**Findings flagged, not "fixed":** the branch never passed `tsc` (fixed in
Phase 1); a benign Docusaurus false-positive anchor warning on
`photography → resources#external-references`; a `postcss-calc` minifier warning
from upstream `@equinor/eds-core-react/next` token CSS.

---

## Phase 1 — Shared component library + icon dogfooding

Built a reusable component library under `src/components/` (colocated
`.tsx`/`.types.ts`/`.css`/`index.ts`, named exports, `displayName`):

- `Icon` — renders `@equinor/eds-icons` `IconData` as inline SVG (dogfoods the
  icon set instead of hand-pasted SVG paths).
- `Hero`, `SectionHeading`, `IconCard` + `IconCardGrid`, `CtaSection`,
  `TeamCard` + `TeamCardGrid`.

**Single-source data** (`src/data/`): `team.ts`, `foundationNav.ts`,
`gettingStartedPaths.ts`, `siteLinks.ts` (killed the 3× hardcoded Slack URL).

Refactored `index`/`about`/`foundation`/`getting-started` pages +
`HomepageSections` onto these. Deleted the duplicate `team-function.tsx` and
consolidated `team.mdx` onto `TeamCardGrid` + the single data source.

**Key issues found & fixed while verifying:**

- CTA buttons rendered invisible (teal-on-teal): wrapping component CSS in
  `@layer docs-components` lost to Infima's *unlayered* base styles. Switched to
  plain unlayered CSS (correct for a Docusaurus/Infima site).
- ESLint couldn't resolve colocated `.css` imports → added `\.css$` to the
  docs-app `import/no-unresolved` ignore list.
- Fixed the pre-existing `@theme/Heading` typecheck failure by using semantic
  tags in the shared components. `tsc` passes now.

---

## Phase 2 — CSS token/utility consolidation + dark-mode fixes

- Deleted 4 dead per-page `*.module.css`.
- Removed the global `* { transition }` (animated every property everywhere).
- Extracted `--docs-gutter` / `--docs-content-max` (replaced ~10 copies of the
  `max(2rem, calc((100% - 1140px)/2))` gutter and scattered `1140px` literals).
- Tokenised literals in `custom.css` and `team.css`: shadows →
  `--eds-elevation-low/high`, `border-radius` → `--eds-spacing-border-radius-rounded`.
- Fixed `rgba(0,0,0,0)` → `transparent`; normalised a stray `576px` breakpoint;
  removed dead commented rules and emoji "tune to taste" comments.

**Dark mode was fundamentally broken (pre-existing) and is now fixed:**

- `--ifm-font-color-base` was remapped to a non-flipping EDS neutral token
  (`#1d1d1d`), so *all* text was near-black on the dark background. Removed the
  override so Infima owns base text colour.
- Hero/muted surfaces used raw `--eds-color-bg-neutral-*` (don't flip here) →
  repointed to Infima's `--ifm-background-surface-color` (flips reliably).
- Secondary text swapped from non-flipping EDS neutral to `--ifm-color-emphasis-*`.

**Rule of thumb learned:** in this Docusaurus app, use **Infima variables for
neutral surfaces/text** (they flip in dark mode); EDS tokens are fine for
accent/brand. EDS *neutral* tokens resolve to their light value regardless of
scheme (a source-order tie with `[data-color-scheme='dark']`).

**Deliberately not done:** the `DocItem/Layout` swizzle to collapse the
`docs-doc-id-*` selector groups — those selectors are added server-side (no
flash); a swizzle would regress to a client-side flash. Kept the SSR-safe
html-class approach; removed only its magic-number repetition.

---

## Phase 3 — Navigation single-source + client-module cleanup

- **Foundation navbar** changed from a hover mega-menu dropdown to a plain link.
  Deleted `foundationDropdownNav.ts` (a global click listener that forced a
  full-page reload) and ~110 lines of mega-menu CSS.
- **Footer is now config-driven**: columns moved into `themeConfig.footer.links`;
  the swizzled `Footer` renders from config instead of a hardcoded array.
- `/foundation` cards derive from `foundationNav.ts` (single source).

`foundationSidebar` left hand-maintained (it has nested sub-page structure the
flat topic list doesn't capture).

---

## Phase 4 — MDX centralisation (one system everywhere)

- `theme/MDXComponents.tsx` registers `Hero`, `SectionHeading`, `IconCard`,
  `IconCardGrid`, `CtaSection`, `Icon`, `StorybookEmbed`, `Tabs`, `TabItem`
  globally — MDX docs use them with no per-file imports.
- **Cards unified onto `IconCard`**: converted `.resource-card`
  (resources/support/accessibility) and `.role-card` (team_roles). `IconCard`
  extended to accept a raw SVG (brand marks) alongside eds-icons, and to open
  external links in a new tab.
- **components.mdx**: removed the nonsensical `.about-hero`/`.about-section`
  wrappers → plain markdown styled by the same landing CSS as resources/support.
  The live-component gallery stays a distinct "preview" card
  (`docs/components/component-gallery.css`, colocated).
- **`StorybookEmbed` component**: migrated **101 raw `<iframe class="sb-iframe">`
  blocks** across 16 component docs to `<StorybookEmbed>`, and removed **76
  `@theme/Tabs`/`TabItem` imports** (now global). Retired
  `sbIframeNoScroll.ts` (the component sets `scrolling="no"` directly).
- **Legacy CSS deleted**: `.resource-card` (custom.css), base `.sb-iframe`
  (→ colocated with `StorybookEmbed`), and `team.css` cut **453 → 220 lines**
  (removed dead `.role-card`, `.component-gallery`/`.mock`, `.team-card`,
  `.img-row`).

**Carve-out:** the getting-started guides + team_roles still use `.about-page`/
`.about-hero`/`.about-section` for their full-width layout. Left because they're
under `/about/` (so the name is defensible there) and are prose-heavy docs where
the doc-id auto-gutter does real work. Already visually aligned via Phase 2.

---

## Ad-hoc fixes during review

- **Content max-width discrepancy**: landing pages used Infima `.container`
  (1320px at ≥1440px) while doc pages used 1140px → capped `.container` at
  `--ifm-container-width` so everything is a consistent 1140px.
- **Hero min-height**: heroes varied (316–428px) and jumped on navigation →
  added `min-height: 27rem` + vertical centring to `.docs-hero` and `.about-hero`.
- **Page background**: unified to grey canvas everywhere (was white on doc
  landing pages, grey on React pages) so white cards get contrast.
- **`/components` cards collapsed to 2px** at wide viewports: `.component-gallery`
  received the doc-id gutter padding **and** had its own `max-width: 1140px` on a
  border-box, so the padding exceeded the max-width and squeezed content to zero.
  Removed the redundant `max-width`/`auto` margins (the gutter centres it).
- **Banner preview clipping**: `.component-gallery__preview` `height: 160px` →
  `min-height: 160px`.

---

## Verification

Every phase verified with:

- `pnpm --filter design-system-docs typecheck` (tsc) — passes.
- `pnpm --filter design-system-docs build` — passes with `onBrokenLinks: 'throw'`.
- `pnpm run lint` — 0 errors (remaining warnings are the pre-existing
  `no-unsafe-*` class the config already downgrades for the docs app).
- Live checks in the dev server (`pnpm start`) in both light and dark mode
  across home, foundation, getting-started, about, resources, support,
  components, a component doc, and team_roles.

## Layout consolidation (follow-up pass)

The visuals were unified but the *layout mechanism* was not — React pages used
`Layout` + `<Hero>`/`.docs-section`, while MDX landing docs relied on the
`docs-doc-id-*` URL-prefix auto-styling over the docs plugin's `.col`/`.container`
chain, and `/components` (which had `displayed_sidebar: null`) differed from
`/resources` (which didn't). Established **two explicit layouts**:

- **Landing layout** — `<DocsLanding>` component (`src/components/DocsLanding`)
  wraps MDX content, breaking it out of the docs `.col` to full width, with
  frontmatter `hide_table_of_contents: true` + `displayed_sidebar: null`. Inside,
  the MDX uses the **same** `<Hero>` + `<section className="docs-section">` +
  `<SectionHeading>` building blocks as the React landing pages. Applied to
  `components.mdx`, `resources.mdx`, `support.mdx`. The full-width CSS
  (`.docs-landing`, renamed from `.about-page`) lives in `custom.css` because it
  targets `main`/`.col` ancestors.
- **Full-width doc layout** — foundation subpages and the component reference
  docs (button, icon, …): a full-bleed hero generated from the doc's first
  heading, hidden sidebar/TOC, gutter-centred content; component docs add the
  tab bar. Driven by the `docs-doc-id-{foundation,components}/` auto-styling,
  scoped `.theme-doc-markdown:not(:has(.docs-landing))` so it does NOT touch the
  landing pages (which share the `docs-doc-id-components/` class but use
  `<DocsLanding>`).

The signal is explicit: content wrapped in `<DocsLanding>` → landing layout;
otherwise → the full-width doc layout.

NOTE: `/components`, `/resources`, `/support` (landings) and the component
reference docs (button, …) all share the `docs-doc-id-components/` html class.
They are distinguished by the presence of `.docs-landing`: the landing pages use
`<DocsLanding>` + explicit `<Hero>`/`<section>`; the reference docs use the
auto-styling. Removing `components/` from the auto-styling breaks the reference
docs, so it must stay — scoped away from `.docs-landing`.

### Final state — exactly two layouts

1. **Landing** — `<DocsLanding>` (MDX) or `@theme/Layout` (React pages) + `<Hero>`
   + `<section className="docs-section">` + `<SectionHeading>` + cards. Used by:
   `/`, `/foundation`, `/getting-started`, `/about` (React pages) and
   `components.mdx`, `resources.mdx`, `support.mdx`, plus the getting-started
   **guides** (`design`, `develop`, `citizen_developers`, `team_roles`). The
   guides were folded in from the old `.about-hero`/`.about-section` system,
   which is now deleted; `team.css` is reduced to just `.about-accordion` (the
   FAQ component on team_roles).
2. **Doc (full-width, auto-hero)** — foundation subpages + component reference
   docs, via the `docs-doc-id-{foundation,components}/` auto-styling (scoped
   `:not(:has(.docs-landing))`); component docs add the `component-doc-tabs` tab
   bar. Signal: no `<DocsLanding>` on a doc under those id prefixes. Fixes found along the way: a duplicate hero (Docusaurus's
auto doc-title `<header>` — now hidden under `.docs-landing`), and inner section
`.container`s being forced full-width by the breakout rule (scoped to
`main:has(.docs-landing) > .container`).

## Net result

`/`, `/foundation`, `/getting-started`, `/about`, `/resources`, `/support`, and
`/components` all share one hero, one section rhythm, one card, one gutter, and
one background — driven by shared components and single-source data, on `--eds-*`
tokens with reliable dark mode. The DOM-hack client modules are gone (only the
legitimate `syncColorScheme.ts` remains).
