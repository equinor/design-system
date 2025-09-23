# @equinor/eds-tokens-build

A build system for generating design tokens from the Equinor Design System (EDS) using Style Dictionary.

## Installation

```bash
npm install @equinor/eds-tokens-build
# or
pnpm add @equinor/eds-tokens-build
# or
yarn add @equinor/eds-tokens-build
```

## Usage

This package provides utilities for building and transforming design tokens using Style Dictionary. It includes pre-configured transforms, filters, and build configurations.

### Basic Token Building

```typescript
import { _extend, includeTokenFilter } from '@equinor/eds-tokens-build'

// Build basic tokens
const config = _extend({
  source: ['tokens/spacing.json'],
  buildPath: 'build/css/',
  fileName: 'spacing',
  filter: (token) => includeTokenFilter(token),
  transforms: ['name/kebab', 'size/px'],
})

await config.buildAllPlatforms()
```

### Creating Light/Dark CSS colour variables

Generate separate CSS files for light and dark themes using the color scheme pattern:

```typescript
import {
  _extend,
  includeTokenFilter,
  mergeLightDarkFoundation,
} from '@equinor/eds-tokens-build'

// Build light color scheme CSS variables
const lightColorScheme = _extend({
  source: ['tokens/light-color-scheme.json'],
  include: ['tokens/light-colors.json'], // Core light colors
  filter: (token) => includeTokenFilter(token, ['Color scheme']),
  buildPath: 'build/css/',
  fileName: 'light-color-scheme',
  selector: '[data-color-scheme="light"]',
  prefix: 'eds-color',
  outputReferences: false,
})

// Build dark color scheme CSS variables
const darkColorScheme = _extend({
  source: ['tokens/dark-color-scheme.json'],
  include: ['tokens/dark-colors.json'], // Core dark colors
  filter: (token) => includeTokenFilter(token, ['Color scheme']),
  buildPath: 'build/css/',
  fileName: 'dark-color-scheme',
  selector: '[data-color-scheme="dark"]',
  prefix: 'eds-color',
  outputReferences: false,
})

await lightColorScheme.buildAllPlatforms()
await darkColorScheme.buildAllPlatforms()

// Merge into a single file using light-dark() CSS function
mergeLightDarkFoundation({
  prefix: 'eds-color',
})
```

This approach:

- Uses `source` for the color scheme tokens (semantic colors like primary, secondary)
- Uses `include` for the base color definitions (hex values, etc.)
- Filters specifically for `['Color scheme']` tokens to avoid outputting all colors
- Generates separate files for each theme with appropriate selectors
- Merges them into a modern CSS file using the `light-dark()` function

### Typography Tokens

```typescript
import {
  _extend,
  includeTokenFilter,
  PX_TO_REM_NAME,
  FONT_QUOTE_NAME,
} from '@equinor/eds-tokens-build'

const typographyConfig = _extend({
  source: ['tokens/typography.json'],
  buildPath: 'build/css/',
  fileName: 'typography',
  selector: '[data-font-size="md"]',
  filter: (token) => includeTokenFilter(token, ['Font size']),
  transforms: ['name/kebab', PX_TO_REM_NAME, FONT_QUOTE_NAME],
  outputReferences: true,
})

await typographyConfig.buildAllPlatforms()
```

### Spacing Tokens

```typescript
import {
  _extend,
  includeTokenFilter,
  PX_TRANSFORM_NAME,
  PX_FORMATTED_NAME,
} from '@equinor/eds-tokens-build'

const spacingConfig = _extend({
  source: ['tokens/spacing.json'],
  buildPath: 'build/css/',
  fileName: 'spacing',
  filter: (token) => includeTokenFilter(token),
  transforms: [
    'name/kebab',
    PX_TO_REM_NAME,
    PX_FORMATTED_NAME,
    PX_TRANSFORM_NAME,
  ],
})

await spacingConfig.buildAllPlatforms()
```

## Available Transforms

The package provides several pre-configured transform constants:

- `PX_TO_REM_NAME` - Convert px values to rem
- `PX_FORMATTED_NAME` - Format px values
- `PX_TRANSFORM_NAME` - Transform px values
- `FONT_QUOTE_NAME` - Add quotes around font family names

## Available Functions

### `_extend(config)`

Creates a Style Dictionary configuration with EDS-specific defaults.

**Parameters:**

- `source: string[]` - Source token files
- `buildPath: string` - Output directory
- `fileName: string` - Output filename
- `filter?: Function` - Token filter function
- `transforms?: string[]` - Transform names to apply
- `selector?: string` - CSS selector for output
- `include?: string[]` - Additional files to include
- `outputReferences?: boolean` - Whether to output token references

### `includeTokenFilter(token, categories?)`

Filters tokens based on categories or general inclusion criteria.

**Parameters:**

- `token: object` - Token object to filter
- `categories?: string[]` - Optional categories to filter by

### `createLightDarkTransform(options)`

Creates a transform for handling light/dark mode color tokens.

**Parameters:**

- `name: string` - Transform name
- `darkTokensObject: object` - Dark mode token values

## Development

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build the package for production
- `pnpm type-check` - Run TypeScript type checking

### Building

```bash
pnpm build
```

This will generate the distribution files in the `dist` directory.

## License

MIT © Equinor
