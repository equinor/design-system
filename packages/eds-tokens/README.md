# @equinor/eds-tokens

[Design tokens] used in the <abbr title="Equinor Design System">EDS</abbr>, including colors, spacing, typography, and more. These tokens are synchronized with Figma variables and provide a single source of truth for design decisions across the design system.

## Installation

```sh
pnpm add @equinor/eds-tokens
```

## Usage

The package provides two token systems:

* **CSS Variables (Recommended)** -- Modern, theme-aware design tokens synced from Figma
* **Legacy Tokens** -- Original token format, still supported for backward compatibility

---

## CSS Variables (Recommended)

The new token system uses CSS custom properties that automatically adapt to light and dark color schemes using the modern `light-dark()` function. These tokens are directly synced from Figma variables.

### Using CSS Variables in CSS

Import the variables stylesheet:

```css
@import '@equinor/eds-tokens/css/variables';
```

Then use the CSS custom properties in your styles:

```css
.my-component {
  background-color: var(--eds-color-bg-neutral-surface);
  color: var(--eds-color-text-neutral-strong);
  border: 1px solid var(--eds-color-border-neutral-subtle);
  padding: var(--eds-spacing-inline-md);
  border-radius: var(--eds-spacing-border-radius-rounded);
}
```

The variables automatically respond to color scheme changes:

```css
/* Applies to elements with data-color-scheme attribute */
[data-color-scheme="dark"] {
  /* Variables automatically use dark mode values */
}

/* Or use the native prefers-color-scheme */
@media (prefers-color-scheme: dark) {
  /* Variables automatically use dark mode values */
}
```

### Using variables in JavaScript/TypeScript

For scenarios where you need colour variables in JavaScript:

#### Color Scheme Tokens

Import the light and dark semantic color tokens:

```typescript
// Import semantic color scheme tokens
import * as lightSemantic from '@equinor/eds-tokens/js/color/color-scheme/light-semantic'
import * as darkSemantic from '@equinor/eds-tokens/js/color/color-scheme/dark-semantic'

// Use semantic tokens with light/dark values
const lightSurface = lightSemantic.BG_NEUTRAL_SURFACE // "#ffffff"
const darkSurface = darkSemantic.BG_NEUTRAL_SURFACE // "#202223"

const lightAccent = lightSemantic.BG_ACCENT_FILL_EMPHASIS_DEFAULT // "#206f77"
const darkAccent = darkSemantic.BG_ACCENT_FILL_EMPHASIS_DEFAULT // "#206f77"

const lightBorder = lightSemantic.BORDER_INFO_MEDIUM // "#6fb6e9"
const darkBorder = darkSemantic.BORDER_INFO_MEDIUM // "#5c9fc9"
```

#### Spacing Tokens

```typescript
// Import spacing values for different density modes
import * as comfortableSpacing from '@equinor/eds-tokens/js/spacing/comfortable'
import * as spaciousSpacing from '@equinor/eds-tokens/js/spacing/spacious'
import * as primitiveSpacing from '@equinor/eds-tokens/js/spacing/primitives'

// Use the values (numbers in pixels)
const padding = comfortableSpacing.SPACING_INLINE_MD // 12
const borderRadius = comfortableSpacing.SPACING_BORDER_RADIUS_ROUNDED // 3
```

### Available Token Categories

* **Colors** -- Semantic color tokens for backgrounds, text, borders, and states
* **Spacing** -- Layout spacing including inline, stack, inset, and border radius
* **Typography** -- Font sizes, line heights, and font families (requires font files)

### Spacing Density Modes

The spacing system supports different density modes:

* `comfortable` -- Default density for most applications
* `spacious` -- Increased spacing for better readability

---

## Legacy Tokens (Backward Compatible)

The original token format is still available for existing applications. These tokens use a structured JavaScript object format.

### Using Legacy Tokens in JavaScript/TypeScript

```javascript
import { tokens } from '@equinor/eds-tokens'

// Access token values
const primaryColor = tokens.colors.interactive.primary__resting.rgba
const spacing = tokens.spacings.comfortable.medium
const typography = tokens.typography.heading.h1
```

### Legacy Token Categories

* Clickbounds
* Colors
* Elevation
* Shape
* Spacing
* Interaction states
* Typography (`ot`, `woff` or `woff2` font required)

> We recommend migrating to CSS Variables for new projects to benefit from automatic theme support and better performance.

[design tokens]: https://css-tricks.com/what-are-design-tokens/


# Sync variables in Figma to tokens in code

This repository contains a couple of GitHub Actions workflows:

- Sync tokens to Figma
- Sync Figma variables to tokens

These workflows demonstrate bi-directional syncing between variables in Figma and design tokens in a codebase using Figma's [Variables REST API](https://www.figma.com/developers/api#variables). For more background and a graphical representation of what these workflows do, see our [Syncing design systems using Variables REST API](https://www.figma.com/community/file/1270821372236564565) FigJam file.

To use these workflows, you should copy the code in this repository into your organization and modify it to suit the needs of your design processes.

## Prerequisites

To use the "Sync Figma variables to tokens" workflow, you must be a full member of an Enterprise org in Figma. To use the "Sync tokens to Figma" workflow, you must also have an editor seat.

Both workflows assume that you have a single Figma file with local variable collections, along with one or more tokens json files in the `tokens/` directory that adhere\* to the [draft W3C spec for Design Tokens](https://tr.designtokens.org/format/). For demonstration purposes, this directory contains the tokens exported from the [Get started with variables](https://www.figma.com/community/file/1253086684245880517/Get-started-with-variables) Community file. Have a copy of this file ready if you want to try out the workflow with these existing tokens.

> \*See `src/token_types.ts` for more details on the format of the expected tokens json files, including the deviations from the draft design tokens spec we've had to make. **We expect there to be one tokens file per variable collection and mode.**

In addition, you must also have a [personal access token](https://www.figma.com/developers/api#access-tokens) for the Figma API to allow these workflows to authenticate with the API. For the "Sync Figma variables to tokens" workflow, the token must have at least the Read-only Variables scope selected. For the "Sync tokens to Figma" workflow, the token must have the Read and write Variables scope selected.

## Usage

Before running either of these workflows, you'll need to create an [encrypted secret](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository) in your repository named `GH_ACTION_VARIABLES_SYNC_FIGMA_TOKEN` containing your personal access token.

Both workflows are configured to [run manually](https://docs.github.com/en/actions/using-workflows/manually-running-a-workflow) for demonstration purposes, and are designed to be as conservative as possible in their functionality (see details below).

### Sync Figma variables to tokens

To run the "Sync Figma variables to tokens" workflow:

- Open the workflow under the **Actions** tab in your repository and click **Run workflow**
- You will be asked to provide the file key of the Figma file. The file key can be obtained from any Figma file URL: `https://www.figma.com/file/{file_key}/{title}`.
- After the workflow finishes, you should see a new pull request if there are changes to be made to the tokens files in the `tokens/` directory. If there are no changes to be made, then a pull request will not be created.

This workflow has some key behaviors to note:

- After generating the new tokens json files, this workflow creates a pull request for someone on the team to review. If you prefer, you can modify the workflow to commit directly to a designated branch without creating a pull request.
- If a variable collection or mode is removed from the Figma file, the corresponding tokens file will not be removed from the codebase.

### Sync tokens to Figma

To run the "Sync tokens to Figma" workflow:

- Open the workflow under the **Actions** tab in your repository and click **Run workflow**
- You will be asked to provide the file key of the Figma file. The file key can be obtained from any Figma file URL: `https://www.figma.com/file/{file_key}/{title}`. Note: if you are trying out this workflow for the first time, use a file that is separate from your design system to avoid any unintended changes.
- After the workflow finishes, open the file in Figma and observe that the variables should be updated to reflect the tokens in your tokens files.

This workflow has some key behaviors to note:

- Though this workflow is configured to run manually, you're free to modify it to run on code push to a specified branch once you are comfortable with its behavior.
- When syncing to a Figma file that does not have any variable collections, this workflow will add brand-new collections and variables. When syncing to a Figma file that has existing variable collections, this workflow will modify collections and variables **in-place** using name matching. That is, it will look for existing collections and variables by name, modify their properties and values if names match, and create new variables if names do not match.
- The workflow will not remove variables or variable collections that have been removed in your tokens files.
- When mapping aliases to existing local variables, we assume that variable names are unique _across all collections_ in the Figma file. Figma allows duplicate variable names across collections, so you should make sure that aliases don't have naming conflicts in your file.
- For optional Figma variable properties like scopes and code syntax, the workflow will not modify these properties in Figma if the tokens json files do not contain those properties.
- If a string variable is bound to a text node content in the same file, and the text node uses a [shared font in the organization](https://help.figma.com/hc/en-us/articles/360039956774), that variable cannot be updated and will result in a 400 response.

## Local development

You can run the GitHub actions locally by running `pnpm install` and creating a `.env` file.

Example: 
```
PERSONAL_ACCESS_TOKEN="your_personal_access_token"
```

[How to create your personal access token](https://www.figma.com/developers/api#access-tokens)

and then running:

```sh
# Defaults to writing to the tokens directory
pnpm run update-tokens

# and / or

pnpm run update-figma
```


## Figma Variables

- The semantic variable is the variable applied to a layer in Figma. 
- A semantic variable can have different modes defined, and the designer can select these


### How the variables are setup with references between collections

The semantic variable references the first segment (collection) in the variable. For example, the first segment is “appearance” for the action variables. Variables defined in appearance point to the next segment, which for action variables would be prominence. In the prominence collection, we define a variable for each of the appearance modes so that these are represented in the context of each prominence mode. The variables in the “prominence” collection point to variables in the state collection, and again, we represent all the prominence modes as new variables in the state collection. For action variables, the journey ends here, and the variables in the state collection point to the light/dark color scheme variables in the color scheme collection. 

### Tokens in code

The color scheme collection variables support all the combinations of modes in the different collections and are used to generate tokens in code. All the combinations of modes in different collections must be provided here so that the code syntax matches tokens in the code. 


### How to setup variable collections in Figma

To set up tokens in Figma, start with the base value defined in the Colour Scheme collection. Once these are defined, you have all the different combinations of a variable and are ready to set up the collections you want to provide. Using the action variables as an example, you would first create the base values and then start with the variable’s last segment(collection). This is the taxonomy of our action variables: `color/action/[appearance]/[prominence]/[state]`.  The last segment in this example would be the “state” collection. The state collection references the base values you defined in the Colour Scheme collection. In the state collection, you should define a variable for each mode in the previous segment; in this example, that would be all the modes you want to define in the prominence collection. Example: primary, secondary, tertiary. When this is ready, you continue to the segment before the prominence collection; in this example, this would be the appearance collection.   The appearance collection is, in this example, the first segment and, therefore, the last collection you need to create. In this collection, you create all the variables you need. In our token taxonomy, we create a variable for different properties (text, icon, border, surface). These variables should reference the variables you created in the previous collection; in this example, that would be the specific appearance variables you created in the prominence collection.
