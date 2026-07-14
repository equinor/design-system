---
title: Accordion
sidebar_position: 1
---


# Accordion

Accordion lets readers reveal and collapse sections of content on demand. It helps manage information density on long pages while keeping the layout scannable, so people can focus on what matters to them without losing the rest of the structure.

<Tabs className="component-doc-tabs" queryString="tab">
<TabItem value="when-to-use" label="When to use" default>

<StorybookEmbed id="eds-2-0-beta-surface-accordion--introduction" height={258} />

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-surface-accordion--introduction)

## When to Use

Use an accordion when a page would otherwise overwhelm readers with long-form content that not everyone needs at once. It works well for grouped supporting detail – FAQs, settings panels, reference material, documentation sections – where the headings give readers a clear map and the panels hold optional depth.

**Avoid Accordion for:**

- Critical information the reader must see – keep it visible in the main flow instead
- Short content that fits without scrolling – the extra click costs more than it saves
- Navigating between pages – use **Link** instead
- Sequential, step-by-step flows – reach for a dedicated stepper pattern

</TabItem>
<TabItem value="structure" label="Structure">

## Structure

Accordion is a compound component built from a small set of parts that compose together:

- **Accordion**: The root wrapper that groups items and controls how they behave together
- **Accordion.Item**: A single collapsible section that holds a header and a panel
- **Accordion.Header**: The clickable summary row with a chevron and a title
- **Accordion.Panel**: The revealed content area shown when the item is open

All Accordion items support:

- **Independent open state** by default – any combination of items can be open at once
- **Exclusive grouping** on the root – opening one item closes the others
- **Controlled and uncontrolled modes** at the item level – let consumers manage open state externally or let the component handle it
- **Density** through the ancestor `data-density` attribute, keeping spacing in step with sibling components

</TabItem>
<TabItem value="guidelines" label="Guidelines">

## Guidelines

### Independent and Exclusive

By default, accordion items open and close independently of one another. This is the right behaviour when sections cover unrelated topics and a reader might reasonably want to compare or hold two open at the same time.

Switch to an exclusive group when the content is mutually exclusive, when keeping multiple panels open would confuse the layout, or when the surrounding container is short on vertical space.

<StorybookEmbed id="eds-2-0-beta-surface-accordion--exclusive" height={198} />

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-surface-accordion--exclusive)

### Controlled and Uncontrolled

Accordion items work uncontrolled out of the box – the component remembers its own open state and you only need to set the initial value. Reach for a controlled item when the open state is part of broader UI logic: syncing with a URL parameter, restoring layout from saved preferences, or co-ordinating with another panel on the page.

<StorybookEmbed id="eds-2-0-beta-surface-accordion--controlled" height={169} />

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-surface-accordion--controlled)

### Density

Accordion follows the active density on its ancestor, so spacing and sizing stay coordinated with the rest of the layout. Use the spacious default in standalone or content-led views, and switch to comfortable density inside dense surfaces like tools, settings panes, or side panels.

<StorybookEmbed id="eds-2-0-beta-surface-accordion--density" height={444} />

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-surface-accordion--density)

</TabItem>
<TabItem value="accessibility" label="Accessibility">

## Accessibility

Accordion is built on the native `<details>` and `<summary>` elements, so disclosure semantics, keyboard support, and screen reader announcements come from the browser without bespoke ARIA wiring.

**Keyboard support:**

- **Tab**: Move focus to and from the accordion header
- **Enter / Space**: Toggle the focused section open or closed

</TabItem>
<TabItem value="figma" label="Figma">

## Figma

### Components

- **Accordion [EDS]**: A single accordion row with the chevron, title, optional content panel, and full state coverage

### Using the Accordion in Figma

1. In the **Assets Panel**, search for **Accordion** and drag the **Accordion [EDS]** component into your frame
2. Stack multiple instances vertically to build a group – the top line on each row handles the shared divider
3. Use the **Open** property to toggle a row between collapsed and expanded
4. Use the **State** property to show **Default**, **Hover**, or **Focus** while documenting interactions
5. Set the **Title** and **Content** text properties on each instance to match your real content

The component reads from the active theme mode on the containing frame, so colours, typography, and spacing follow the rest of your composition without manual overrides.

</TabItem>
<TabItem value="dos-and-donts" label="Do's and don'ts">

## Do's and Don'ts

:::info **Do**

- Write headers that clearly describe what is inside, so readers can decide whether to open a section
- Reach for an exclusive group when only one panel should be visible at a time
- Use accordions to support a primary layout, not to replace it
- Keep panel content focused – one topic per item makes the structure scannable

:::

:::danger **Don't**

- Hide content people are likely to need on every visit – keep that visible in the main flow
- Nest accordions inside accordions – the layering quickly becomes hard to follow
- Stack a single accordion item on its own – a plain disclosure or section is clearer
- Bury deeply nested headings inside a panel – flatten the content or split it across items

:::

</TabItem>
</Tabs>
