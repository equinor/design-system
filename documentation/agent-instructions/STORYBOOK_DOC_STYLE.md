# Storybook Doc Style Guide

The canonical structure for `/next` component documentation **inside Storybook**.

This is the counterpart to [`COMPONENT_DOC_STYLE.md`](./COMPONENT_DOC_STYLE.md), which governs the documentation site at `apps/design-system-docs`. The two surfaces are complementary, not parallel. `COMPONENT_DOC_STYLE.md` states the division:

> **Storybook = implementation reference.** Owns props with literal values, code snippets, callback signatures, integration patterns (react-hook-form, debounce, controlled vs uncontrolled wiring), and the precise list of ARIA roles and attributes.

The docs site owns design decisions: when to use the component, structure, guidelines, do's and don'ts. **Do not duplicate that material here.** Link to it with `documentationUrl` instead.

## Table of Contents

- [Scope](#scope)
- [Mechanism](#mechanism)
- [Section Order](#section-order)
- [Section Rules](#section-rules)
- [Example Subsection Names](#example-subsection-names)
- [Language](#language)
- [Links](#links)
- [Mobile and Platform Tabs](#mobile-and-platform-tabs)
- [Output Template](#output-template)
- [Verification Checklist](#verification-checklist)

## Scope

Applies to every component under `packages/eds-core-react/src/components/next/`.

**Exempt:** Foundation pages (`Foundation/Elements`, `Foundation/Typography`). They document a system rather than a component, so the component outline does not fit. They still follow [Language](#language). The mobile docs treat `Introduction.mdx` and `EDSProvider.mdx` the same way.

## Mechanism

Use **attached MDX**. Create `ComponentName.docs.mdx` beside the story file and attach it with `<Meta of={ComponentStories} />`. The file is picked up by the stories glob in `.storybook/main.mjs`.

Do **not** use `parameters.docs.page`. Both mechanisms render a page, but attached MDX keeps all wiring out of the story file, leaving `.stories.tsx` as `meta` plus stories and nothing else.

Global `autodocs` is enabled in `.storybook/preview.mjs`. Attached MDX replaces the generated page for that component and does **not** create a duplicate sidebar entry.

The story file must not carry `parameters.docs.description.component`. Prose lives in the MDX. Leaving it in both places means maintaining two copies of the same text.

Per-story descriptions (`parameters.docs.description.story`) **stay in the story file**. `<Canvas of={...} />` renders them automatically beneath the story.

## Section Order

Every component doc follows this order. Skip a section that has no content. Never invent content to fill one.

1. `# ComponentName`
2. One or two sentences saying what it is and what it is for
3. Beta callout
4. `<Links />`
5. `## Features`
6. `## Usage`
7. `## Props and playground`
8. `## Examples`
9. Optional extra reference sections
10. `## Accessibility`
11. `## Related components`

## Section Rules

### Opening description

Mandatory. One or two sentences. Say what the component is and what it is for. This is the only place a reader who lands cold learns what they are looking at, so it cannot be skipped even when the component seems self-evident.

### Beta callout

One canonical form, immediately after the description:

```markdown
**⚠️ Beta.** This component is under active development and may have breaking changes.
```

`meta` also carries `tags: ['beta']`, which drives the sidebar badge. Both are required: the tag marks the entry, the callout warns the reader.

### `## Features`

An **inventory of the API surface**. State what exists, not why it exists.

| Rule |
| --- |
| No justification clauses. If a bullet has a "so that" tail, cut the tail |
| No usage guidance. That belongs in `## Usage`, or on the docs site |
| Do not restate what a dedicated section covers in full |
| Enumerate options inline in backticks |

```markdown
✅ - Ten sizes, `xs` through `6xl`, mapped to the `--eds-sizing-icon-*` tokens.
✅ - Two variants: `solid` (default) and `outlined`.
❌ - Token-based sizing — uses EDS design tokens for consistent sizing.
❌ - Automatic sizing, which is the recommended way to place an icon inline with text.
```

### `## Usage`

The install command followed by the canonical import and the minimal code shapes:

````markdown
```bash
npm install @equinor/eds-core-react@beta
```

```tsx
import { ComponentName } from '@equinor/eds-core-react/next'
```
````

The install command and the import path are different things and both belong here. `@equinor/eds-core-react@beta` is what you install; `@equinor/eds-core-react/next` is what you import from.

The install command goes **here**, not above the fold. It is setup detail, not identity.

### `## Props and playground`

```markdown
<Primary />
<Controls />
```

`<Controls />` is the props table. It generates from the component's types and `argTypes`, so it cannot drift from the code. Never hand-write a props table on web.

The heading names both things the section holds. `<Controls />` is interactive and mutates the primary story's args, so the story has to be visible alongside it or moving a control changes something the reader cannot see.

Do not add a separate `## Props` section using `<ArgTypes />`. It lists the same props again with one column fewer.

### `## Examples`

One `###` per axis or scenario, each with a live story:

```markdown
### Sizes

<Canvas of={ComponentStories.Sizes} />
```

Uncapped. A component with twelve meaningful examples has twelve subsections. Use `<Canvas of={...} />` rather than static code blocks so the example is live and its story description renders with it.

### Optional extra reference sections

Behaviour that is neither a usage snippet nor a variant example goes in its own `##` section between `## Examples` and `## Accessibility`. Icon's `## Sizing` documents a size-resolution precedence chain; mobile's Typography doc does the same with `## Sizes`.

Without this slot, such content gets crammed into the opening description, which is how the original drift started.

### `## Accessibility`

Mandatory for every component. Optional only for the exempt Foundation pages.

Covers keyboard interaction, the WAI-ARIA pattern implemented, what is announced to assistive technology, and focus management. This is content the docs site explicitly delegates here, so Storybook is the only place it exists.

### `## Related components`

Links to sibling components with one clause saying when to reach for them instead. Use Storybook paths:

```markdown
- [`Checkbox`](?path=/docs/eds-2-0-beta-inputs-selection-controls-checkbox--docs) selects one or more items from a set.
```

## Example Subsection Names

An **open** list. Where a subsection documents one of these standard axes, use the canonical name. Anything genuinely scenario-specific gets a descriptive name of its own.

| Canonical axis names |
| --- |
| `States` · `Sizes` · `Tones` · `Variants` · `Density` · `Light & dark mode` |

This kills the drift where one concept had several names, without flattening distinct scenarios into one bucket:

| Do not write | Write |
| --- | --- |
| `Disabled States`, `Validation States`, `Disabled & Read only` | `States` |
| `Dark mode`, `Light & Dark Mode` | `Light & dark mode` |
| `Density Modes` | `Density` |

Scenario names stay descriptive and free-form: `With Cancel button`, `Selecting multiple from a list`, `With React Hook Form`, `Auto-size from Typography`.

## Language

Follows [`COMPONENT_DOC_STYLE.md`](./COMPONENT_DOC_STYLE.md#formatting-conventions), with these points restated because they are the ones most often broken here:

- **Never use em-dashes (`—`).** Restructure the sentence rather than swapping in a hyphen or a colon.
- **Avoid dashes as clause separators generally.** Write a complete sentence instead.
- **British English.** "colour", "behaviour", "centre".
- **Sentence case headings**, matching the mobile docs. `## Related components`, not `## Related Components`.
- Prop and token names in backticks.

## Links

One `<Links />` row, directly under the beta callout. All link types in a single row.

| Prop | Source | Required |
| --- | --- | --- |
| `documentationUrl` | `https://eds.equinor.com/docs/Next/components/{category}/{component}` | When a docs site page exists |
| `npmUrl` | `https://www.npmjs.com/package/@equinor/eds-core-react` | Always |
| `sourceUrl` | `https://github.com/equinor/design-system/blob/main/packages/eds-core-react/src/components/next/{Component}/{Component}.tsx` | Always |
| `figmaUrl` | Line 6 of `{Component}.figma.tsx`, where a Code Connect file exists | When a Figma frame exists |
| `ariaUrl` | The relevant W3C APG pattern | When a pattern applies |

`ariaUrl` is required wherever the APG has a matching pattern, which covers most interactive components. It does not apply to static elements: there is no APG pattern for an icon.

`figmaUrl` cannot always be harvested from Code Connect. `Field`, `Icon`, `Input`, `Switch` and `TextField` have no `.figma.tsx`, and icons live in the separate `EDS-Assets` Figma file rather than `EDS-Core-Components`. Confirm those with design rather than guessing a node ID.

## Mobile and Platform Tabs

Where `packages/eds-mobile-components/docs/{Component}.mdx` exists, wrap the web content in `<PlatformTabs>` and pass the mobile doc:

```mdx
import { Links, PlatformTabs } from './../../../../.storybook/components'
import MobileDocs from '@equinor/eds-mobile-components/docs/ComponentName.mdx'

<PlatformTabs mobile={<><Links npmUrl="..." sourceUrl="..." /><MobileDocs /></>}>
  {/* web content */}
</PlatformTabs>
```

Omit `PlatformTabs` entirely when there is no mobile counterpart. It renders `children` unchanged without a `mobile` prop, but the wrapper and its import earn nothing.

Content inside the tabs should read with the same shape on both platforms, since switching tabs otherwise feels like landing on a different site. The mobile docs are the origin of this outline for that reason.

One divergence is deliberate:

| Mobile | Web | Why |
| --- | --- | --- |
| `## Props`, hand-written markdown table | `## Props and playground`, `<Primary />` + `<Controls />` | React Native has no `<Controls />`, so mobile hand-writes a static table. On web the generated table is the props reference and comes with a live demo attached |

The subpath import `@equinor/eds-mobile-components/docs/*.mdx` resolves by plain filesystem lookup because that package declares no `exports` field. Adding an `exports` map without declaring `./docs/*` will break every page that imports a mobile doc.

## Output Template

```mdx
import { Primary, Canvas, Controls, Meta } from '@storybook/addon-docs/blocks'
import * as ComponentStories from './ComponentName.stories'
import { Links } from './../../../../.storybook/components'

<Meta of={ComponentStories} />

# ComponentName

[One or two sentences: what it is and what it is for.]

**⚠️ Beta.** This component is under active development and may have breaking changes.

<Links
  documentationUrl="..."
  npmUrl="https://www.npmjs.com/package/@equinor/eds-core-react"
  sourceUrl="..."
/>

## Features

- [Inventory of the API surface. What exists, not why.]

## Usage

```bash
npm install @equinor/eds-core-react@beta
```

```tsx
import { ComponentName } from '@equinor/eds-core-react/next'
```

## Props and playground

<Primary />
<Controls />

## Examples

### [Canonical axis name, or a descriptive scenario name]

<Canvas of={ComponentStories.StoryName} />

## Accessibility

- [Keyboard interaction, ARIA pattern, what is announced, focus management.]

## Related components

- [`Sibling`](?path=/docs/...) [when to reach for it instead].
```

## Reference Exemplar

`packages/eds-core-react/src/components/next/Icon/Icon.docs.mdx` is the worked reference. It exercises every section including an optional extra one (`## Sizing`).

## Verification Checklist

Before considering a component's doc done:

- [ ] `ComponentName.docs.mdx` exists and attaches via `<Meta of={...} />`, not `parameters.docs.page`
- [ ] `parameters.docs.description.component` removed from the story file
- [ ] Per-story `description.story` values left in place
- [ ] Opening description present, even if the component seems obvious
- [ ] Beta callout in the canonical form, and `tags: ['beta']` in `meta`
- [ ] One `<Links />` row with every applicable link type
- [ ] `## Features` has no justification tails and no usage guidance
- [ ] Install command inside `## Usage`, not above the fold
- [ ] `## Props and playground` uses `<Primary />` + `<Controls />`, with no second props table
- [ ] Standard axes use canonical `###` names
- [ ] `## Accessibility` present
- [ ] No em-dashes anywhere in the file
- [ ] Sentence case headings
- [ ] `<PlatformTabs>` present if and only if a mobile doc exists
- [ ] Page renders without console errors and produces no duplicate sidebar entry
- [ ] Every piece of content has exactly one home on the page
