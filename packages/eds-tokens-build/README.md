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
import { _extend, includeTokenFilter } from '@equinor/eds-tokens-build';

// Build basic tokens
const config = _extend({
  source: ['tokens/spacing.json'],
  buildPath: 'build/css/',
  fileName: 'spacing',
  filter: (token) => includeTokenFilter(token),
  transforms: ['name/kebab', 'size/px']
});

await config.buildAllPlatforms();
```

### Color Tokens with Light/Dark Mode

```typescript
import { 
  _extend, 
  createLightDarkTransform, 
  includeTokenFilter 
} from '@equinor/eds-tokens-build';
import { readJsonFiles } from '@equinor/eds-tokens-sync';
import { StyleDictionary } from 'style-dictionary-utils';

// Read dark mode tokens
const darkTokens = readJsonFiles(['tokens/dark-theme.json']);

// Create and register light/dark transform
const lightDarkTransform = createLightDarkTransform({
  name: 'lightDarkMatrix',
  darkTokensObject: darkTokens['dark-theme.json']
});

StyleDictionary.registerTransform(lightDarkTransform);

// Build color tokens with light/dark support
const colorConfig = _extend({
  source: ['tokens/light-theme.json'],
  include: ['tokens/core.json'],
  buildPath: 'build/css/',
  fileName: 'colors',
  selector: ':root',
  filter: (token) => includeTokenFilter(token, ['Color']),
  transforms: ['name/kebab', 'color/css', 'lightDarkMatrix'],
  outputReferences: true
});

await colorConfig.buildAllPlatforms();
```

### Typography Tokens

```typescript
import { 
  _extend, 
  includeTokenFilter,
  PX_TO_REM_NAME,
  FONT_QUOTE_NAME 
} from '@equinor/eds-tokens-build';

const typographyConfig = _extend({
  source: ['tokens/typography.json'],
  buildPath: 'build/css/',
  fileName: 'typography',
  selector: '[data-font-size="md"]',
  filter: (token) => includeTokenFilter(token, ['Font size']),
  transforms: ['name/kebab', PX_TO_REM_NAME, FONT_QUOTE_NAME],
  outputReferences: true
});

await typographyConfig.buildAllPlatforms();
```

### Spacing Tokens

```typescript
import { 
  _extend, 
  includeTokenFilter,
  PX_TRANSFORM_NAME,
  PX_FORMATTED_NAME 
} from '@equinor/eds-tokens-build';

const spacingConfig = _extend({
  source: ['tokens/spacing.json'],
  buildPath: 'build/css/',
  fileName: 'spacing',
  filter: (token) => includeTokenFilter(token),
  transforms: ['name/kebab', PX_TO_REM_NAME, PX_FORMATTED_NAME, PX_TRANSFORM_NAME]
});

await spacingConfig.buildAllPlatforms();
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
