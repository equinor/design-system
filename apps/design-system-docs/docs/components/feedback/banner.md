---
title: Banner
sidebar_position: 1
---

# Banner

Banners display important, brief messages and provide optional actions for users to respond to. They are designed to inform, warn, or alert users about something relevant to their current context - such as a system change, an error, or a required action. Banners are interruptive by nature, so their level of interruption should match the significance of the information they carry.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-feedback-banner--introduction"
  width="100%"
  height="128"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-feedback-banner--introduction)

## When to Use

Use a banner when you need to communicate a change, error, or important notification within an application.

**Avoid banners for:**

- Temporary success confirmations - use **Snackbar** instead
- Blocking the user from interacting with the page - use **Dialog** instead
- Inline form validation messages - use field-level feedback instead

## Structure

Banner is a compound component made up of the following parts:

- **`Banner`** - the root container that sets the tone and role
- **`Banner.Icon`** (optional) - a supporting icon that reinforces the message tone
- **`Banner.Message`** (required) - the text content communicating the notification
- **`Banner.Actions`** (optional) - buttons or links that let the user respond to the banner

## Guidelines

### Tones

Tones communicate the intent or severity of the banner message. Each tone uses a distinct colour scheme - border, background, and icon colour - to visually differentiate the level of urgency.

| Tone    | Use Case                                                      |
| ------- | ------------------------------------------------------------- |
| Info    | General information, status updates, or helpful tips          |
| Warning | Caution about potential issues or actions that need attention |
| Danger  | Errors, critical alerts, or destructive consequences          |
| Success | Positive confirmations or successful completions              |

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-feedback-banner--all-variants"
  width="100%"
  height="600"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-feedback-banner--all-variants)

### Actions

Actions allow users to respond directly to the banner message. They can contain buttons or links.

- Action buttons should directly relate to the banner's message and clearly represent the intended action
- Actions can be placed **inline** (beside the text) when space allows, or **stacked** (below the text) when the message is longer

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-feedback-banner--with-actions"
  width="100%"
  height="128"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-feedback-banner--with-actions)

**Stacked actions**

Use `placement="bottom"` on `Banner.Actions` when the message is long and action buttons need more room.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-feedback-banner--actions-bottom"
  width="100%"
  height="160"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-feedback-banner--actions-bottom)

**Links as actions**

Banners can also use links as actions for navigating to more information.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-feedback-banner--with-link"
  width="100%"
  height="128"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-feedback-banner--with-link)

### Dismissible

When the `onDismiss` callback is provided, a close button is rendered in the top-right corner. Use this when the user should be able to acknowledge and remove the banner.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-feedback-banner--dismissible"
  width="100%"
  height="128"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-feedback-banner--dismissible)

## Accessibility

- Banners use `role="status"` by default, which politely announces content to screen readers
- For urgent messages that require immediate attention, set `role="alert"` to interrupt the screen reader
- Ensure banner messages are concise and clearly describe the situation
- Action buttons and links must have descriptive labels that explain what will happen when activated
- Avoid relying on colour alone to convey meaning - always pair tone colours with an icon or clear text

## Figma

### Components

- **Banner [EDS]** - the banner component with configurable tone, layout, icon, action, and dismiss options

### Using the Banner in Figma

1. In Figma, go to the **Assets Panel** and search for **Banner**
2. Drag the component into your frame
3. Select the component to see its properties in the **Design Panel**

### Property Structure

- **Tone** - set the tone (Info, Warning, Danger, or Success) to control the colour scheme
- **Actions** - choose between None, Buttons, or Link
- **Layout** - choose between Inline (actions beside text) or Stacked (actions below text)
- **Dismiss** - toggle the dismiss close button on or off
- **Icon** - toggle the leading icon on or off

## Do's and Don'ts

:::info **Do**

- Keep banner messages brief and actionable
- Use tones consistently to communicate the right level of urgency
- Show only one banner at a time per context
- Label action buttons with clear, descriptive text
- Pair tone colours with icons for better clarity
- Use `role="alert"` for urgent messages that need immediate attention
  :::

:::danger **Don't**

- Stack multiple banners on top of each other
- Use banners for messages that don't require user awareness or action
- Rely on colour alone to communicate meaning - pair with icons and clear text
- Use icon-only action buttons inside banners - always use text labels
- Leave banners visible indefinitely if the situation has been resolved
  :::
