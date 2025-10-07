# Snackbar

_Snackbars_ provide brief temporary non-interrupting notifications at the bottom of the screen.

## When to Use

Snackbars inform users of an activity that an app has performed or will perform.

- Snackbars appear temporarily, and disappear on their own without claiming user input to be dismissed
- Snackbars are placed in the most suitable area of a UI, mainly at the bottom of the UI and in a front of app content

## Variants

#### Simple

- Snackbars appear without warning, and do not require user interaction
- When multiple snackbar updates are necessary, they should appear one at a time

#### With action

A snackbar can contain a single action, a single text button that lets users take action on a process performed by the app.

## Guidelines

Snackbars provide an update on a process that has or will be performed. Snackbars deliver low priority information while _banners_ deliver medium priority and _dialogs_ deliver high priority. Snackbars appear centered at the bottom of the screen and disappear without user interaction. On wider screens they are left-aligned. Snackbars appear on-screen between 5-10 seconds before dismissing themselves, so keep text short.

Snackbars can have one action. This action should not be **Close** or **Dismiss** since snackbars disappear automatically. Actions such as **Undo** or **Retry** are acceptable. Snackbars can wrap up to two lines of text on smaller screens.

## Implementation in Figma

1.  In Figma go to the **Assets Panel** and search for **snackbar**.
2.  Drag and drop the component in your frame.
3.  Rename and resize the component if needed.

## Do's and don'ts

✅  Display only one snackbar at a time

❌  Do not place a snackbar in front of frequently used touch targets or navigation

