---
title: Link
sidebar_position: 4
---

# Link

Links are clickable text elements that take users to other pages, documents, or locations within a page. They are essential for navigation and help users discover and move between content. Links should always have clear, descriptive text so users understand where they will be taken.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-navigation-link--introduction"
  width="100%"
  height="83"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-navigation-link--introduction)

## When to Use

Use a link when the user needs to:

- Navigate to a new page, internally or externally
- Jump to another location on the same page
- Download a file

**Avoid links for:**

- Performing actions like "Save" or "Log in" - use **Button** instead
- Changing application state such as opening dialogs, starting processes, or saving data - use **Button** instead

## Structure

Link has two definitions:

- **Link**: A text-only link used for both inline and standalone contexts.
- **External link**: A standalone link with a trailing external-link icon, signalling that the user will leave the current application context.

## Guidelines

### Variants

#### Inline

Inline links sit within body text and inherit the surrounding typography. Use them when linking to related content or references within a sentence.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-navigation-link--inline"
  width="100%"
  height="115"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-navigation-link--inline)

#### Standalone

Standalone links are used outside of body text, such as in navigation areas, card footers, or call-to-action sections. They use the UI font family.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-navigation-link--standalone"
  width="100%"
  height="83"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-navigation-link--standalone)

### External Links

When a link takes the user outside the current application context, use the external link variant. This includes a trailing external-link icon to clearly communicate that the destination is outside the app.

Use `target="_blank"` with `rel="noreferrer"` to open external links in a new tab.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-navigation-link--external-link"
  width="100%"
  height="83"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-navigation-link--external-link)

### Link Text

Good link text is self-explanatory and meaningful when read independently - this is especially important for users relying on assistive technologies.

- Place important trigger words early in the text
- Include verbs to clarify the action (e.g., "Read the accessibility guidelines")
- Ensure link text is unique within the page
- Never use generic text like "Click here", "Read more", or "Link to"

### Opening in New Tabs

Both internal and external links should open in the current tab for a predictable user experience. Exceptions include:

- Systems that require logout during navigation
- Users mid-process who risk losing content
- Links to supportive content during task completion

In these cases, add "(opens in a new tab)" to the link text so users know what to expect.

## Accessibility

- **Keyboard**: Links are natively focusable and activated with Enter
- **Focus indicator**: A visible focus ring appears on keyboard navigation using `focus-visible`
- **Descriptive text**: Link text must describe the destination - avoid "Click here" or "Read more"
- **External links**: When opening in a new tab, include "(opens in a new tab)" in the link text or as visually hidden text for screen readers
- **Colour contrast**: Link colour meets WCAG 2.1 AA contrast requirements against the background

## Figma

### Components

- **Link [EDS]**: Available in both inline and standalone variants

### Using the Link in Figma

1. In Figma, go to the **Assets Panel** and search for **Link**
2. Drag the component into your frame
3. Select the component to see its properties in the **Design Panel**
4. Set the **Type** to either **Inline** or **Standalone**

## Do's and Don'ts

:::info **Do**

- Use inline links within running text for contextual navigation
- Use standalone links outside of body text for prominent navigation
- Write descriptive link text that makes sense out of context
- Indicate when a link opens in a new tab
- Use the external link variant when navigating outside the application
  :::

:::danger **Don't**

- Use links for actions that change application state - use **Button** instead
- Use generic link text like "Click here", "Read more", or "Link"
- Open links in new tabs without informing the user
- Use the external-link icon for internal navigation
- Rely on colour alone to distinguish links from surrounding text
  :::