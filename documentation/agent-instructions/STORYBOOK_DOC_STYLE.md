# Storybook Component Docs

This is the canonical reference for how a component's Storybook page, including its React Native tab, is made. `scripts/generate-component-docs.js` generates the page from the component's code and a short hand-written file. The Docusaurus guide, [`COMPONENT_DOC_STYLE.md`](./COMPONENT_DOC_STYLE.md), covers when and why to use a component. This guide covers how.

It is for anyone writing or changing a component's docs: developers, AI agents and reviewers. It is not for readers of the Storybook page.

## Adding docs to a component

1. Document the `NameProps` type. Give every prop a JSDoc description, add `@default` where it has a default, and list what each fixed value means in the JSDoc of its type.
2. Write `Name.stories.tsx`. On web, name the playground story `Introduction`. Add one export for each example, with a caption in `parameters.docs.description.story`. On mobile the stories are example code only.
3. Create `Name.docs.md` next to the component, on each platform it exists on. The web file has the Summary. Add `aria:` or `docs:` metadata if the component has them.
4. Run `pnpm run generate:component-docs Name`.
5. Open the page in Storybook and read it, including the React Native tab.
6. Run `pnpm run generate:component-docs --check`, then commit the generated pages with the rest of the change.

## Files

Everything for a component sits in the folder that holds `Name.tsx`. On mobile that can be a shared folder: `SelectionControls/` holds Checkbox, Radio and Switch.

| File                                                                       | Written by                              | Gives the page                      |
| -------------------------------------------------------------------------- | --------------------------------------- | ----------------------------------- |
| `NameProps` type or interface, in any non-test file of the folder          | The developer, along with the component | Features and props                  |
| `Name.stories.tsx`                                                         | The developer                           | Examples and captions               |
| `Name.docs.md`                                                             | A person                                | What code cannot tell us, see below |
| `Name.figma.tsx` (web)                                                     | The developer                           | The Figma link                      |
| `Name.docs.mdx` (web), `docs/Name.mdx` in `eds-mobile-components` (mobile) | The generator                           | The pages. Never edit them          |

Mobile story files only supply example code. They are excluded from the build and the npm package, and `tsconfig.docs.json` type-checks them through the mobile package's `types` script, which CI runs.

## Page structure

Both platforms use the same sections in the same order, and the React Native tab sits on the same page as the React tab.

| Section            | Web                                        | Mobile           | Source                                                       |
| ------------------ | ------------------------------------------ | ---------------- | ------------------------------------------------------------ |
| Summary            | Above the tabs, shared                     | Not in the tab   | Hand-written, web file only                                  |
| Beta callout       | Above the tabs                             | Not in the tab   | Generated                                                    |
| Links row          | In the tab                                 | In the tab       | Generated                                                    |
| Features           | Required                                   | Required         | Generated from the props, plus optional hand-written bullets |
| Usage              | Required                                   | Required         | Install and import generated, snippet hand-written           |
| Props              | `Props and playground`, with live controls | `Props`, a table | Generated                                                    |
| Examples           | Required                                   | Required         | The stories file                                             |
| Accessibility      | Required                                   | Required         | Hand-written                                                 |
| Related components | Optional                                   | Optional         | Hand-written                                                 |

## The hand-written file

`Name.docs.md` has an optional metadata block, then fixed sections:

````markdown
---
aria: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
docs: inputs/selection_controls
---

## Summary

<!-- Notes to the author. Comments never reach the page. -->

What the component is, where it is used, and what to use instead when it does not fit.

## Features

- One bullet for behaviour the props do not show.

## Usage

```tsx
<Badge tone="success">Approved</Badge>
```

## Accessibility

- What the section must cover, see below.

## Related components

- [`Chip`](…) is the selectable counterpart.
````

| Part                                                  | Web                            | Mobile                                       |
| ----------------------------------------------------- | ------------------------------ | -------------------------------------------- |
| `aria:`, a W3C URL                                    | Optional                       | Not used                                     |
| `docs:`, for a docs page shared by several components | Optional                       | Not used                                     |
| Summary                                               | Required                       | Rejected, it is written once in the web file |
| Features                                              | Optional, required if no props | Same                                         |
| Usage, Accessibility                                  | Required                       | Required                                     |
| Related components                                    | Optional                       | Optional                                     |

Any other heading or metadata key fails the generator. Metadata is not content and never renders as a section.

## Section rules

**Summary.** What the component is, where it is used, and what to use instead when it does not fit. It sits above both tabs, so it must be true on both platforms. Put platform differences in Features or Usage. Required, with no length limit.

**Features.** An inventory of the API, not guidance. The generator writes one bullet per prop: fixed values with the default, `children` with its type, and other props with their JSDoc description. Describe each fixed value in the type's JSDoc, one line per value:

```ts
/**
 * Visual emphasis level.
 * - `low`: Subtle background (canvas) or light border
 * - `medium`: More prominent fill or medium border
 */
export type BadgeEmphasis = 'low' | 'medium'
```

Add hand-written bullets only for behaviour the props do not show, such as "Hidden from screen readers by default". At least one bullet is required.

**Usage.** The smallest correct snippet, without the import. The generator adds the install command and the import.

**Props.** Generated from `NameProps`. Every prop needs a JSDoc description, or the generator fails, and a `@default` tag where it has a default. Props declared in `node_modules`, such as HTML attributes and `ViewProps`, are not listed. Props from a base type in this repo are. With no props of its own, mobile prints "Name has no props of its own" and the Features come from the hand-written file.

**Examples.** At least one besides the playground, which is web's `Introduction` story. Every other export that is a function or an object is an example, titled from its name (`InlineWithText` becomes "Inline with text"). Add a caption with `parameters.docs.description.story`, worded for the reader and true on that platform. A story showing every combination is welcome, but do not describe it as being for testing.

**Accessibility.** Cover each topic that applies, with as many bullets as needed:

- the role, or that it has none
- focus, and which keys operate it
- what a screen reader announces and what it does not, such as a tone shown by colour only
- what the consumer must supply, such as a label

A non-interactive component says so and says it is not focusable.

**Related components.** Leave the section out when nothing relates.

## Links row

| Link                  | Shown on                     | Source                                                                   |
| --------------------- | ---------------------------- | ------------------------------------------------------------------------ |
| GitHub source         | Each tab                     | The component's file path                                                |
| npm                   | Each tab                     | The package name                                                         |
| Figma                 | Each tab, when one exists    | The web `Name.figma.tsx`                                                 |
| Docusaurus design doc | Each tab, when a page exists | The docs-site page named after the component, or `docs:` in the metadata |
| WAI-ARIA pattern      | React tab only               | `aria:` in the metadata                                                  |

A component has one design doc across platforms. Add `aria:` only where a W3C pattern describes the component. Badge is a static element, so it has none.

## Writing rules

- Use British English.
- Never use en or em dashes. The generator stops if one reaches a page. This is stricter than `COMPONENT_DOC_STYLE.md`, which allows en dashes on the Docusaurus site.
- Put `<` and `{` inside code spans. Sidecar text, prop descriptions and story captions all end up in an MDX page, so a tag such as `<Chip>` or a brace expression in running text breaks the Storybook build.
- Write full sentences. Use a table or list for findings and comparisons.
- State only what the code or a test shows, and check claims copied from older docs.
- Keep `tags: ['beta']` in the story meta. The beta callout is generated.

## What is checked

| Rule                                                            | Generator fails           | Left to review |
| --------------------------------------------------------------- | ------------------------- | -------------- |
| Required sections present, no unknown sections or metadata keys | Yes                       |                |
| No Summary in a mobile file                                     | Yes                       |                |
| `aria:` is a W3C URL, and a `docs:` page exists                 | Yes                       |                |
| At least one Feature and one Example                            | Yes                       |                |
| Every prop has a JSDoc description                              | Yes                       |                |
| No en or em dashes in a page                                    | Yes                       |                |
| Generated pages are up to date                                  | Yes, with `--check` in CI |                |
| `@default` tags on props with defaults                          |                           | Yes            |
| Accessibility covers the topics that apply                      |                           | Yes            |
| British English, and claims that match the code                 |                           | Yes            |

```bash
pnpm run generate:component-docs            # every component with a hand-written file
pnpm run generate:component-docs Badge      # one component
pnpm run generate:component-docs --check    # exit 1 if a generated page is stale
```

CI runs the check before the build. After changing a type, a story or a hand-written file, regenerate and commit the pages in the same change.

## Not covered yet

- A component that exists only on mobile needs its own Summary and a standalone page under `packages/eds-core-react/stories/mobile/`. The generator does not support it yet.
- The Foundation pages (Typography and Elements) are outside this outline.
