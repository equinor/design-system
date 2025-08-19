# Banner

When expanded use tab to review current page headings and press enter or space to navigate to the selected section

FEEDBACK

# Banner

_Banners_ display important notifications and related optional actions.

### Text and icon

### Text and action

### Text, action and icon

## Guidelines

### Usage

Banners should communicate a change or error and require an action in order to be dismissed. Banners deliver medium priority information while  deliver low priority and  deliver high priority. Banners are meant to be slightly interruptive but not overly distracting.

### Placement

Banners are always at the top of the page but below the . Banners can be fixed or scroll away with content. They should fill 100% of the width of the main content area. They are not to go over open  or fixed  but beside them.

Banners are also known as  or alerts.



# Dialog

When expanded use tab to review current page headings and press enter or space to navigate to the selected section

FEEDBACK

# Dialog

_Dialogs_ display critical notifications and required actions.

**More examples available in** **.**

## Guidelines

A dialog is a modal window that appears over everything on the screen and always over a . Dialogs can appear without warning and require users to stop their current task so they should be used sparingly. The dialog disables all application functionality and requires an action to be taken in order to be dismissed.

Dialogs can contain a Title, Content and Actions. A dialog can have one or two actions, but never a third. Actions should always be related to the message. Dialogs should try to avoid scrollable content. When scrolling is necessary, the title and actions are fixed and the content scrolls.

In the notification family, dialogs are the most interruptive.  deliver medium priority slightly interruptive notifications, and  deliver low priority un-interruptive notifications. Since dialogs are very disruptive, they should be used only in critical situations.



# Progress indicators

When expanded use tab to review current page headings and press enter or space to navigate to the selected section

FEEDBACK

# Progress indicators

_Progress indicators_ are animated helpers that indicate waiting time as content loads.

### Circular

#### Indeterminate

#### Determinate

### Dots

### Linear

#### Indeterminate

#### Determinate

### Star

#### Indeterminate

#### Determinate

## Guidelines

Progress indicators inform users about the current loading state giving them insight into the process. Progress indicators may be determinate or indeterminate.

Determinate progress indicators indicate how long the process will take. They should be used once there is an estimate of wait time available.

Indeterminate progress indicators indicate an unknown amount of time the process will take. They should be used when there is _not_ an estimated wait time available.

#### Linear

Linear progress indicators are great to focus attention to an area. They are great for places like empty pages, at the bottom of the , and in  and .

#### Circular

Circular progress indicators are great for places like icons and empty pages. They should be used for short waiting times.

#### Dots

Dot progress indicators are for use within .

#### Star

Star progress indicators are to be used on splash screens and empty pages only.



# Scrim

When expanded use tab to review current page headings and press enter or space to navigate to the selected section

FEEDBACK

# Scrim

A _scrim_ is a temporary visual effect that fades the general interface while allowing the user to focus on an overlay.

## Guidelines

Always use a scrim with an overlay component such as a dialog, elevated  or elevated navigation  (mobile only).

#### Interactions

When the scrim is clicked on or the `Esc` key is pressed the overlay component will close, closing the scrim with it.

A `Scrim` shows behind all other surfaces in an app, displaying contextual and actionable content.

-   The scrim’s back layer is persistent, displaying controls and content that relate to the front layer.
    
-   The scrim focuses attention on one layer at a time.
    
-   The scrim is displayed at full width and holds primary content.
    
-   The scrim can be closed by either interacting with the front layer, using \`esc\` button or tapping a conceal affordance on either layer.



# Snackbar

When expanded use tab to review current page headings and press enter or space to navigate to the selected section

FEEDBACK

# Snackbar

_Snackbars_ provide brief temporary non-interrupting notifications at the bottom of the screen.

### Simple

-   Snackbars appear without warning, and do not require user interaction.
    
-   When multiple snackbar updates are necessary, they should appear one at a time.
    

  

### With action

A snackbar can contain a single action, a single text button that lets users take action on a process performed by the app.

## Guidelines

Snackbars provide an update on a process that has or will be performed. Snackbars deliver low priority information while  deliver medium priority and  deliver high priority. Snackbars appear centered at the bottom of the screen and disappear without user interaction. On wider screens they are left-aligned. Snackbars appear on-screen between 5-10 seconds before dismissing themselves, so keep text short.

Snackbars can have one action. This action should not be "Close " or "Dismiss" since snackbars disappear automatically. Actions such as "Undo" or "Retry" are acceptable. Snackbars can wrap up to two lines of text on smaller screens.