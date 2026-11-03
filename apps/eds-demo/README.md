# EDS beta tokens demo

A small Next.js app that shows how to build an interface with the beta design tokens from the Equinor Design System (`@equinor/eds-tokens@beta`). It has one screen, a people dashboard with a top bar, side navigation, tabs, a selectable table, status badges, buttons and an account menu, and every colour, spacing, radius, type size and shadow on it comes from a token.

The strip at the top of the page switches between the finished screen and an exercise, between the light and dark colour scheme, and between the compact, comfortable and relaxed density.

## Running it

From the repository root:

```sh
pnpm install
pnpm demo:dev
```

Next.js starts on <http://localhost:3000>, or on the next free port if 3000 is taken. Nothing in the monorepo has to be built first: the app installs the published `@equinor/eds-tokens@3.0.0-beta.10`, `@equinor/eds-core-react@3.0.0-beta.5` and `@equinor/eds-icons` from npm.

## How the tokens and components are loaded

`src/app/globals.css` imports the token bundle and the component styles once, the same way an application outside this repository would:

```css
@import '@equinor/eds-tokens/next/css/variables.css';
@import '@equinor/eds-core-react/next/index.css';
```

The buttons and icons are the EDS `Button` and `Icon` from `@equinor/eds-core-react/next`, which are on the beta tokens in 3.0.0-beta.5. The component stylesheet does not contain the token bundle, so both imports are needed. It does contain the 2.x token bundle, in a layer below the beta tokens, for the components that have not moved to the beta names yet.

`src/app/layout.tsx` renders `data-color-scheme` and `data-density` on `<html>` from two cookies, so the server sends the page in the right colour scheme and density, and the first paint is correct. The toolbar changes the attributes in the browser at once and stores the choice in the cookies for the next request. `data-color-scheme` is on `<html>` because the elevation shadows only resolve when the attribute is set on the root element.

Two more details are needed by any app that uses the bundle:

- The font tokens resolve to the family names `Inter` and `Equinor`, and the tokens package ships no font files. `layout.tsx` loads both from the EDS variable font stylesheet, `https://cdn.eds.equinor.com/font/eds-uprights-vf.css`, which also sizes Equinor to Inter's x-height. The older `equinor-font.css` has only Equinor, so text in the UI family would fall back to another font.
- The bundle switches token values on `data-color-scheme` but does not set the CSS `color-scheme` property, so `globals.css` sets it. Without it, scrollbars, form controls and `light-dark()` stay light in the dark scheme.

For the full setup, see [Using the tokens](https://storybook.eds.equinor.com/?path=/docs/beta-foundation-using-the-tokens--docs) in Storybook and the [eds-tokens README](../../packages/eds-tokens/README.md#beta-the-redefined-token-structure).

## Where the design decisions are

Each element on the screen has two classes with the same name:

| File                                       | What it holds                                                                                                                           |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/_components/structure.module.css` | Layout only: flex, grid, positioning and the popover anchor. No design decisions, and the same on both pages                            |
| `src/app/tokens.module.css`                | Every colour, spacing, radius, typography and elevation decision on the screen, with comments that explain the choice of each token     |
| `src/app/exercise/tokens.module.css`       | The same selectors with hard-coded values: px for spacing and type, `light-dark(white, black)` for colour, and hints for what to change |

`tokens.module.css` is the file to show and read. Each section in it says where its values come from:

| Part of the screen                                        | Source                                                                                                                   |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Search field                                              | Search [EDS Beta] in Figma, without label and helper text                                                                |
| Account menu                                              | Menu [EDS Beta] in Figma, Layout Separator, with Menu Item Type Custom                                                   |
| Tabs                                                      | Tab [EDS Beta] in Figma, Type Simple                                                                                     |
| Status labels                                             | Badge [EDS Beta] in Figma, Solid, Low emphasis, with a leading icon                                                      |
| Table | The work-in-progress table on the "↪ Cell" page of a branch of the Core Components file: Header and Header Checkbox in the header row, Checkbox Cell, Text Cell and Badge Cell in the body |
| Top bar, side navigation, page header, page layout | Not designed yet. The values are the demo's own choice from the token scale, and the components above are placed in them |

The buttons (Export, Add person and the icon buttons in the top bar) and every icon are the EDS components, so their styles are not in this file. Icon sizes are set with the `Icon` `size` prop, which takes the spacing token of the same name.

"Figma" means the variable bindings of that component in the EDS Core Components file, state by state. A Figma variable name becomes the CSS name with the slashes turned into dashes: `spacing/xs` is `--eds-spacing-xs`. At the comfortable density every component above renders at the size of its Figma frame.

The only literal values are the stroke widths, as Figma draws them (1px borders and focus rings, the 2px line under a tab; there is no width token), 150ms for transitions (there is no motion token yet) and the 250px width that Figma gives the search field and the menu.

## The exercise

Open **Exercise** in the toolbar, or go to `/exercise`. The markup is the same as the solution, and `src/app/exercise/tokens.module.css` holds placeholder values to replace with tokens. Start at the top of the file and follow the 🐨 hints. Switch to **Dark** and to **Compact** or **Relaxed** while you work: the parts you have converted follow the switch, and the rest stays as it is.

The finished version is `src/app/tokens.module.css`.

## Tests

The Playwright tests start their own dev server on port 3100, so they never reuse another app on port 3000.

```sh
pnpm demo:test:e2e                          # run the tests
pnpm --filter eds-demo run test:e2e:update  # update the screenshots
```

See [tests/README.md](./tests/README.md) for what they cover.
