# EDS beta tokens demo

A small Next.js app that shows how to build an interface with the beta design tokens from the Equinor Design System (`@equinor/eds-tokens@beta`). It has one screen, a people dashboard with a top bar, side navigation, tabs, a selectable table, status badges, buttons and an account menu, and every colour, spacing, radius, type size and shadow on it comes from a token.

The strip at the top of the page switches between the finished screen and an exercise, between the light and dark colour scheme, and between the compact, comfortable and relaxed density.

## Running it

From the repository root:

```sh
pnpm install
pnpm demo:dev
```

Next.js starts on <http://localhost:3000>, or on the next free port if 3000 is taken. Nothing in the monorepo has to be built first: the app installs the published `@equinor/eds-tokens@3.0.0-beta.9` and `@equinor/eds-icons` from npm.

## How the tokens are loaded

The bundle is imported once, in `src/app/globals.css`, the same way an application outside this repository would import it:

```css
@import '@equinor/eds-tokens/next/css/variables.css';
```

`src/app/layout.tsx` renders `data-color-scheme` and `data-density` on `<html>` from two cookies, so the server sends the page in the right colour scheme and density, and the first paint is correct. The toolbar changes the attributes in the browser at once and stores the choice in the cookies for the next request. `data-color-scheme` is on `<html>` because the elevation shadows only resolve when the attribute is set on the root element.

Two more details in `globals.css` are needed by any app that uses the bundle:

- `--eds-font-family-ui` resolves to `Inter`, so Inter has to be loaded under that family name. The app loads it from `@fontsource/inter`, one file per weight token (400, 500 and 700). Equinor, for headers, comes from the EDS CDN in `layout.tsx`.
- The bundle switches token values on `data-color-scheme` but does not set the CSS `color-scheme` property, so the app sets it. Without it, scrollbars, form controls and `light-dark()` stay light in the dark scheme.

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
| Export and Add person buttons                             | `Button/button.css` in `eds-core-react`, which is already on the beta tokens                                             |
| Icon buttons in the top bar                               | Button [EDS Beta] in Figma: Icon button on, Ghost, Neutral, Default size and style                                       |
| Search field                                              | Search [EDS Beta] in Figma, without label and helper text                                                                |
| Account menu                                              | Menu [EDS Beta] in Figma, Layout Separator, with Menu Item Type Custom                                                   |
| Tabs                                                      | Tab [EDS Beta] in Figma, Type Simple                                                                                     |
| Row checkboxes                                            | Checkbox [EDS Beta] in Figma, No Label                                                                                   |
| Status labels                                             | Badge [EDS Beta] in Figma, Solid, Low emphasis, with a leading icon                                                      |
| Top bar, side navigation, table, page header, page layout | Not designed yet. The values are the demo's own choice from the token scale, and the components above are placed in them |

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
