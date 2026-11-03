# EDS beta tokens demo

An exercise app for the beta design tokens from the Equinor Design System (`@equinor/eds-tokens@beta`). It shows a people dashboard (a top bar, side navigation, tabs, a selectable table, status badges, buttons and an account menu) next to a CSS editor. The CSS in the editor is everything the dashboard's design depends on, and every change shows in the dashboard as you type. It is split into four files, one for each part of the screen (`page.css`, `top-bar.css`, `navigation.css` and `table.css`), and the tabs above the editor switch between them. Each file opens where you left it.

The **Tokens** tab on the right edge of the editor opens the token reference: every published beta token, in groups (background, text, icon, border, spacing, corner radius, typography, font, elevation, overlay), with a preview in the colour scheme and density of the dashboard, and the value for sizes and fonts. Click a token to put it in the CSS at the cursor: it replaces a selection, completes a name you have started typing, and adds `var()` around it when you are not already inside one. The filter at the top narrows the list by name.

The strip at the top switches between:

- **Exercise** and **Solution**: the exercise CSS has placeholder values to replace with tokens, the solution CSS is the finished version. Both are editable. **Ctrl + Shift + S** (**⌘ + Shift + S** on a Mac) switches between them and keeps your place in the CSS: the same rule, at the same height in the editor.
- **Row**, **Column** and **Fullscreen**: the dashboard and the editor side by side, stacked, or the dashboard alone. In Row and Column, drag the divider between them to resize, move it with the arrow keys, or double-click it to share the space evenly. Its position is saved for each view.
- The **colour scheme**, which changes the dashboard and the app around it, and the **density**, which changes the dashboard only. The editor keeps its own dark theme.
- **Inspect**: shows the class names of the element under the pointer in the dashboard. Click an element to open its file and put the cursor on its first rule. While Inspect is on, clicks do not reach the dashboard.
- **Restart**: after a confirmation, puts back the original CSS of the mode you are viewing.

Edits are saved in the browser (`localStorage`), for each file of the exercise and the solution on its own, so a reload keeps them.

## Running it

From the repository root:

```sh
pnpm install
pnpm demo:dev
```

Next.js starts on <http://localhost:3000>, or on the next free port if 3000 is taken. Nothing in the monorepo has to be built first: the app installs the published `@equinor/eds-tokens@3.0.0-beta.10`, `@equinor/eds-core-react@3.0.0-beta.5` and `@equinor/eds-icons` from npm.

`pnpm demo:build` builds a static site into `apps/eds-demo/out/`, which any static host can serve (`trailingSlash` gives every page its own `index.html`). `pnpm demo:start` serves that folder on <http://localhost:3200>. To serve it from a sub-path, such as `/demo`, set `NEXT_PUBLIC_BASE_PATH=/demo` when building. Where the demo is hosted has not been decided yet.

## How it is put together

| Path                                       | What it is                                                                                                   |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `/` (`src/app/(app)/`)                     | The editor app: the strip, the frame and the editor                                                          |
| `/preview/` (`src/app/(preview)/preview/`) | The dashboard alone, loaded into the frame's `<iframe>`                                                      |
| `src/css/exercise/`, `src/css/solution/`   | The CSS that opens in the editor, one file per tab. Both folders have the same files with the same selectors |
| `src/app/(preview)/preview/structure.css`  | The dashboard's layout: flex, grid, positioning and the popover anchor. No design decisions, not editable    |
| `src/app/_components/`                     | The dashboard's markup, the same for the exercise and the solution                                           |

The dashboard runs in an iframe because the CSS in the editor is plain global CSS (`.top-bar { … }`), which must not reach the editor app, and because `data-color-scheme` has to sit on the dashboard's own `<html>`: the elevation shadows only resolve when it is set on the root element. The editor sends its CSS to the frame with `postMessage` after a short pause in typing, and the frame puts it in one `<style>` element after every other stylesheet. The frame lays the dashboard out at 1280 × 810 and scales it to fit, so a narrow frame still shows the desktop layout.

The page reads the CSS files and the token bundle at build time, so the CSS stays in normal `.css` files in the repository. The frame gets the files of a mode joined, in the order of the tabs. The editor is CodeMirror 6 with the One Dark theme. It completes token names: type `--eds-` to list the published beta tokens (the semantic names, without primitives or the density layer).

### When the tokens are updated

The token names in the autocomplete and the token reference are not written in the demo. `readTokenNames()` in `src/lib/sources.ts` reads them at build time from the installed bundle, `@equinor/eds-tokens/next/css/variables.css`, which is the same file the dashboard imports. The previews and values are resolved by the browser from `var()`. To move to a new release, change the version of `@equinor/eds-tokens` in `package.json`, install and build: new tokens appear, and removed ones disappear.

Two lists in the code decide what is shown and where:

- `PUBLISHED` in `src/lib/sources.ts` holds the prefixes of the published names (`background`, `text`, `spacing` and so on). It keeps the primitives and the density layer out. A token with a new prefix is left out until the prefix is added there.
- `src/lib/tokens.ts` sorts the names into the groups by their pattern. A published name that fits none of the patterns is listed in an **Other** group without a preview, so it is not lost, and the test "lists every published token in a group" fails until the patterns are updated.

## How the tokens and components are loaded

The dashboard's stylesheet imports the token bundle and the component styles once, the same way an application outside this repository would:

```css
@import '@equinor/eds-tokens/next/css/variables.css';
@import '@equinor/eds-core-react/next/index.css';
```

The buttons and icons are the EDS `Button` and `Icon` from `@equinor/eds-core-react/next`, which are on the beta tokens in 3.0.0-beta.5. The component stylesheet does not contain the token bundle, so both imports are needed. It does contain the 2.x token bundle, in a layer below the beta tokens, for the components that have not moved to the beta names yet.

Two more details are needed by any app that uses the bundle:

- The font tokens resolve to the family names `Inter` and `Equinor`, and the tokens package ships no font files. Both layouts load them from the EDS variable font stylesheet, `https://cdn.eds.equinor.com/font/eds-uprights-vf.css`, which also sizes Equinor to Inter's x-height.
- The bundle switches token values on `data-color-scheme` but does not set the CSS `color-scheme` property, so the dashboard's stylesheet sets it. Without it, scrollbars, form controls and `light-dark()` stay light in the dark scheme.

For the full setup, see [Using the tokens](https://storybook.eds.equinor.com/?path=/docs/beta-foundation-using-the-tokens--docs) in Storybook and the [eds-tokens README](../../packages/eds-tokens/README.md#beta-the-redefined-token-structure).

## Literal values in the solution

The buttons and icons are the EDS components, so their styles are not in the CSS. Icon sizes are set with the `Icon` `size` prop, which takes the spacing token of the same name. The only literal values in the CSS are the stroke widths (1px borders and focus rings, the 2px line under a tab), because there is no width token, and 150ms for transitions.

## The exercise

Open the app; it starts on **Exercise**, in `page.css`. The core path is six numbered 🐨 steps in `page.css`, `top-bar.css` and `table.css`, which together use colour, spacing, typography and elevation tokens once each. 💯 marks extras for those who finish early, and every rule without a mark is an extra too; `navigation.css` is all extras. Switch to **Dark** and to **Compact** or **Relaxed** while you work: the parts you have converted follow the switch, and the rest stays as it is. Press **Ctrl + Shift + S** to compare a rule with the solution and again to go back.

## Tests

The Playwright tests build the static export and run against it, served on port 3100, so they never reuse another app on port 3000.

```sh
pnpm demo:test:e2e                          # build and run the tests
pnpm --filter eds-demo run test:e2e:update  # build and update the screenshots
```

See [tests/README.md](./tests/README.md) for what they cover.
