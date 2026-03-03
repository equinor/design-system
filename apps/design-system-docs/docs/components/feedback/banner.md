---
title: Banner
sidebar_position: 1
---

# Banner

Banners display important, brief messages and provide optional actions for users to respond to. They are designed to inform, warn, or alert users about something relevant to their current context - such as a system change, an error, or a required action.

<!-- TODO: Add hero iframe when Storybook story is available
<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-feedback-banner--default"
  width="100%"
  height="100"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-feedback-banner--default)
-->

## When to Use

Use a banner when you need to communicate a change, error, or important notification within an application. Banners are interruptive by nature, so their level of interruption should match the significance of the information they carry.

**Avoid banners for:**

- Temporary success confirmations - use **Snackbar** instead
- Blocking the user from interacting with the page - use **Dialog** instead
- Inline form validation messages - use field-level feedback instead

## Structure

A banner is a compound component made up of the following parts:

- **Message** (required) - the text content communicating the notification
- **Icon** (optional) - a supporting icon that reinforces the message tone
- **Actions** (optional) - buttons that let the user respond to the banner

## Guidelines

### Tones

Tones communicate the intent or severity of the banner message:

| Tone    | Use Case                                                     |
| ------- | ------------------------------------------------------------ |
| Info    | General information, status updates, or helpful tips         |
| Warning | Caution about potential issues or actions that need attention |
| Danger  | Errors, critical alerts, or destructive consequences         |

Each tone uses a distinct colour scheme - border, background, and icon colour - to visually differentiate the level of urgency.

<!-- TODO: Add tones iframe when Storybook story is available
<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-feedback-banner--tones"
  width="100%"
  height="250"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-feedback-banner--tones)
-->

### Variants

Banners support several layout combinations depending on the content needed:

- **Text only** - a simple message without icon or actions
- **Text with icon** - a message reinforced by a supporting icon
- **Text with actions (horizontal)** - message with action buttons placed inline to the right
- **Text with actions (vertical)** - message with action buttons placed below the text
- **Icon, text with actions** - the full combination of icon, message, and action buttons

Actions can be placed horizontally (beside the text) when space allows, or vertically (below the text) when the message is longer and space is limited.

<!-- TODO: Add variants iframe when Storybook story is available
<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-feedback-banner--all-variants"
  width="100%"
  height="400"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-feedback-banner--all-variants)
-->

### Actions

- Buttons in banners should directly relate to the banner's message and clearly represent the intended action
- Buttons must be labelled with text, not icons, for clarity
- Place buttons beside the banner message when there is enough room, or below the message for longer text

### Density

Density modes adjust the overall spacing and sizing of banners:

- **Spacious** - the default density with comfortable padding, recommended for most interfaces
- **Comfortable** - a more compact option for dense UIs

## Accessibility

- Banners use `role="alert"` to announce their content to screen readers when they appear
- Ensure banner messages are concise and clearly describe the situation
- Action buttons must have descriptive labels that explain what will happen when activated
- Avoid relying on colour alone to convey meaning - always pair tone colours with an icon or clear text

## Figma

### Components

- **Banner [EDS]** - the banner component with configurable tone, density, icon, and action options

### Using the Banner in Figma

1. In Figma, go to the **Assets Panel** and search for **Banner**
2. Drag the component into your frame
3. Select the component to see its properties in the **Design Panel**

### Property Structure

- **Tone** - set the tone (Info, Warning, or Danger) to control the colour scheme
- **Density** - choose between Spacious and Comfortable
- **Show Icon** - toggle the leading icon on or off
- **Show Actions** - toggle action buttons and configure their placement (horizontal or vertical)

## Do's and Don'ts

:::info **Do**

- Keep banner messages brief and actionable
- Use tones consistently to communicate the right level of urgency
- Show only one banner at a time
- Label action buttons with clear, descriptive text
- Consider banners as part of your overall in-app messaging strategy
:::

:::danger **Don't**

- Stack multiple banners on top of each other
- Use banners for messages that don't require user awareness or action
- Rely on colour alone to communicate meaning - pair with icons and clear text
- Use icon-only action buttons inside banners - always use text labels
- Leave banners visible indefinitely if the situation has been resolved
:::
