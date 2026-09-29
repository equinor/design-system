# Mobile documentation lives alongside web's — Docusaurus for design docs, web Storybook for developer docs

- **Status:** Accepted (recorded retrospectively 2026-09-24)
- **Date:** 2026-04-09 (after a first plan, all in Docusaurus, in design-system-mobile#112 on 2026-03-23, which followed earlier discussions that weren't recorded; changed to this decision in design-system-mobile#141 and design-system-internal#255)
- **Decision makers:** EDS Core Team
- **Scope:** Mobile

## Context

`eds-mobile-components` lived in its own repository, `equinor/design-system-mobile`, with its own MkDocs documentation site on Radix. During the Slice 1 work in early 2026, the team discussed where each kind of mobile documentation should live: in a separate mobile setup, or in web's Docusaurus and Storybook wherever the content overlaps. The first written plan (design-system-mobile#112, 2026-03-23) put all mobile documentation into Docusaurus, pulling developer docs from the mobile repo through a remote-content plugin and showing them in Web/Mobile tabs. The MkDocs site was removed on 2026-03-30, and design-system-mobile#141 set up the plugin with a tabbed Button page as a proof of concept. On 2026-04-09, after a team discussion, the plan changed to the split this ADR records: the existing Docusaurus design docs serve mobile as well, and developer docs go into web's Storybook (design-system-internal#255). All of this happened before the [#5138](https://github.com/equinor/design-system/issues/5138) monorepo move, which later replaced the npm dependency with a workspace link.

Mobile documentation isn't one thing — it splits into concerns with different audiences and different tooling needs:

- **Design docs** — guidelines, when to use a component, anatomy, do/don't. Largely platform-agnostic prose and imagery, aimed at anyone deciding whether a component fits their use case.
- **Developer docs** — install instructions, usage snippets, prop tables, examples. Aimed at engineers integrating the component.
- **Hands-on native testing** — verifying a component actually looks and behaves right on a physical device or simulator, which no web page can substitute for.

## Decision Drivers

- Design guidance for a component that exists on both platforms doesn't need two documents — the same page serves both, since mobile and web users are deciding whether the same component fits their use case; duplicating a whole site to say the same thing twice invites drift.
- A native Expo/React Native component cannot be verified visually from a web page — a Storybook story rendered in a browser does not prove the component renders correctly on iOS.
- Consuming teams should be able to find any component's documentation without needing to know which repo or platform team wrote it.

## Options Considered

### Option 1: Fully separate mobile documentation, mirroring the pre-monorepo setup

Keep a dedicated documentation site for `eds-mobile-components` covering design guidance, developer usage, and on-device testing entirely on its own, independent of web's Docusaurus and Storybook.

**Pros:**

- Mobile owns its documentation lifecycle independently of web's release cadence
- No coupling to web's Storybook/Docusaurus tooling choices

**Cons:**

- This is what `design-system-mobile` had until March 2026: a MkDocs site on Radix with its own component sidebar, separate from web's. It covered developer usage only (code, props, accessibility), so extending it with design guidance would repeat what the Docusaurus page for the web counterpart already says
- A consuming team has to know to look in two different places depending on platform
- Doubles the documentation maintenance surface for content that's mostly shared

### Option 2: Split documentation by type, sharing web's Docusaurus and Storybook wherever content overlaps (chosen)

Design docs live on the shared EDS Docusaurus site, developer docs live inside web's Storybook via a platform-tab pattern, and hands-on native testing uses a real native app distributed through TestFlight rather than a second web Storybook.

**Pros:**

- Design guidance that's shared across platforms lives in one place instead of two
- Developer docs for both platforms sit on the same Storybook page, so an engineer finds the React Native usage next to the web usage. The only new piece is a small React/React Native tab component (`PlatformTabs`)
- On-device testing uses an actual native app, the only way to genuinely verify native rendering
- Consuming teams check the same two sites (Docusaurus, web Storybook) regardless of platform

**Cons:**

- Developer docs for a mobile component now live inside `eds-core-react`'s Storybook via an import, coupling mobile's doc publishing to a web package's build
- Design docs for a mobile-only component (no web counterpart) still need somewhere to live that isn't just "a repo nobody else reads"
- A consumer skimming web Storybook has to know to click into a platform tab to find the mobile variant, rather than it being the default view

### Option 3: Put all mobile documentation — design and developer — into Docusaurus, skip Storybook for mobile entirely

Write mobile's usage instructions, props, and examples as Docusaurus prose pages, with no Storybook presence at all.

This was the first written plan (design-system-mobile#112), and design-system-mobile#141 built a proof of concept with Web/Mobile tabs on the Docusaurus Button page. The team moved away from it on 2026-04-09. The reasons given in that discussion weren't written down, so the con below describes how the choice reads now rather than an argument on record.

**Pros:**

- Single site, single format, for every kind of mobile documentation

**Cons:**

- Web developer docs already live in Storybook; splitting mobile's developer docs into a different site than web's breaks the "same two sites regardless of platform" property Option 2 achieves

## Decision

**Adopt Option 2.** Mobile documentation splits by type rather than living in one dedicated mobile site:

| Type                    | What                                       | Where                                                                   |
| ----------------------- | ------------------------------------------ | ----------------------------------------------------------------------- |
| Design docs             | Guidelines, when to use, anatomy, do/don't | EDS Docusaurus site, shared with web                                    |
| Developer docs          | Install, usage, props, examples            | Web Storybook, alongside the equivalent web component's docs            |
| Hands-on native testing | Verifying real on-device behaviour         | A native Expo app (`apps/mobile-storybook`), distributed via TestFlight |

Developer docs use a `PlatformTabs` component, added to web's Storybook for this purpose in #4868: each web component's `.docs.mdx` imports the mobile package's own MDX file directly and passes it into a `PlatformTabs` component's `mobile` prop. For example, `Button.docs.mdx` does `import MobileDocs from '@equinor/eds-mobile-components/docs/Button.mdx'` and renders `<MobileDocs />` inside `PlatformTabs`'s `mobile` slot. A reader on Button's Storybook page switches to the mobile tab and sees mobile's own usage, examples, and props content, without mobile needing its own Storybook instance. This is static markdown, the same as it would be on any other site — moving it into Storybook doesn't add interactivity, it just puts it next to the equivalent web page.

A mobile-only component (no web equivalent) has no web `.docs.mdx` to host a `PlatformTabs` mobile tab, so its developer docs get a standalone page under `stories/mobile/` that imports its MDX file directly instead — the same mechanism `stories/mobile/About.mdx` already uses for the package's introduction page, just applied per-component. No mobile-only component has needed this yet; only the introduction and a components index live under `stories/mobile/` today.

There is deliberately no separate React Native Storybook as a documentation website — a second Storybook instance would duplicate the sidebar and furniture `PlatformTabs` already handles inside web's. `apps/mobile-storybook` exists, but despite its name it doesn't use Storybook: it is an Expo Router app for hands-on component testing on a real device or simulator, not a documentation site; it ships to testers via TestFlight, triggered automatically by `.github/workflows/trigger_publish.yml`'s `trigger-mobile-ios` job whenever a mobile-components or mobile-storybook release lands.

A component that exists on both platforms has one design doc, the existing page at `apps/design-system-docs/docs/components/{category}/{component}.md`, with no mobile-specific additions — the team agreed on 2026-04-09 that the current Docusaurus documentation is sufficient for mobile as well (design-system-mobile#141). A mobile-only component (no web equivalent) gets its own design doc at that same path pattern instead — not pulled from `design-system-mobile` via a remote-content plugin as design-system-internal#255 originally proposed, since that repo is now archived following the [#5138](https://github.com/equinor/design-system/issues/5138) monorepo move.

### Consequences

- Good: design guidance shared across platforms lives in one place; a consuming team reads the same Docusaurus page regardless of which platform they're building for.
- Good: on-device testing runs in a native app (`apps/mobile-storybook`). Web Storybook could show React Native components through `react-native-web`, but that wouldn't verify how they render on iOS.
- Good: TestFlight distribution is already wired into CI (`trigger-mobile-ios`) — no manual step is needed to get a build in front of testers; only the final public App Store submission stays manual.
- Bad: mobile developer docs are static markdown with no live preview — the `mobile` slot never renders `<Controls />` or `<Canvas />`, unlike the web tab on the same page. Moving them into Storybook doesn't change that; it only changes where the static content sits. This was a deliberate choice: live components run in the TestFlight app instead (design-system-mobile#141). Adding live previews later would mean rendering the components through `react-native-web` in web Storybook.
- Bad: a mobile component's developer docs only render correctly once `@equinor/eds-mobile-components/docs/<Component>.mdx` exists and is imported into the matching web `.docs.mdx`. There's no build-time check for this — if it's left out, `PlatformTabs` silently falls back to `if (!mobile) return <>{children}</>`, a web-only page with no mobile tab and no error.
- Bad: the published Storybook reads mobile's docs through the `workspace:^` link (#5138), and `docs/` no longer ships in the npm package (#5454). The mobile tab therefore shows mobile's `main` as of the last Storybook deploy, not the latest npm release, and can describe props that haven't been released yet.

### Confirmation

- A new mobile component that also exists on web gets its developer docs added as `@equinor/eds-mobile-components/docs/<Component>.mdx` and imported into the equivalent web component's `.docs.mdx` via `PlatformTabs`'s `mobile` prop, following the `Button.docs.mdx` pattern.
- A mobile component's developer docs go on its `/next` counterpart's `.docs.mdx`, never an EDS 1.0 page for the same component even if that's the only one that currently exists, and never Storybook's auto-generated docs page, which can't host `PlatformTabs` at all.
- A mobile-only component (no web equivalent) gets its developer docs as a standalone page under `packages/eds-core-react/stories/mobile/` that imports its MDX directly, following the `stories/mobile/About.mdx` pattern — not nested inside a web component's docs, since there isn't one to nest inside.
- A proposal to add a new web-facing Storybook instance, or a separate documentation site, dedicated to mobile gets rejected in review — `apps/mobile-storybook` stays a native testing app distributed via TestFlight, not a documentation site.
- A mobile-only component's design doc gets a manual entry in `apps/design-system-docs/sidebars.ts`, the same as every other component doc — the page existing on disk isn't enough for a consumer to find it.

## Related

- Source discussion: [design-system-internal#255](https://github.com/equinor/design-system-internal/discussions/255)
- Linking Docusaurus component pages to a component's mobile tab in Storybook is tracked separately: [#5554](https://github.com/equinor/design-system/issues/5554)
- Tracking issue for this ADR batch: [#5515](https://github.com/equinor/design-system/issues/5515)
