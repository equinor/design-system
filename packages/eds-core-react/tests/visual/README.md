# Visual Regression Tests for Typography Components

This directory contains Playwright visual regression tests for the Typography component system.

## Overview

The tests leverage existing Storybook stories to ensure visual consistency across:

* **TypographyNext**: Flexible typography component with full property control
* **Heading**: Semantic heading component (h1-h6)
* **Paragraph**: Block-level paragraph component

## Test Coverage

### TypographyNext Component
- Font families (ui, header)
- All text sizes (xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl)
- Line heights (default, squished)
- Font weights (lighter, normal, bolder)
- Letter spacing/tracking (tight, normal, wide)
- Baseline alignment (grid, center) with debug mode
- Combined property variations

### Heading Component
- All heading levels (h1-h6)
- Font weights per heading level
- Letter spacing variations
- Line height options
- Baseline grid alignment with debug mode
- Combined properties
- All variants story screenshot

### Paragraph Component
- All text sizes
- Line heights
- Font weights
- Letter spacing
- Baseline grid alignment with debug mode
- Combined property variations
- All variants story screenshot

## Running Tests

### Prerequisites

Make sure Storybook dependencies are installed:

```bash
pnpm install
```

### Run Visual Tests

```bash
# Run all visual tests
pnpm test:visual

# Run tests in UI mode for debugging
pnpm test:visual:ui

# Update snapshots when intentional changes are made
pnpm test:visual:update
```

### Continuous Integration

Tests run automatically in CI using Chromium. The baseline screenshots are stored in `tests/visual/*.spec.ts-snapshots/`.

## How It Works

1. **Playwright** starts a Storybook server on `http://localhost:9000`
2. Tests navigate to specific story URLs with query parameters
3. Screenshots are captured after the page reaches `networkidle` state
4. Screenshots are compared against baseline images
5. Any differences trigger test failures

## Story URL Format

Stories are accessed via iframe URLs:
```
/iframe.html?id=typography-<component>--<story>&args=<prop>:<value>&viewMode=story
```

Example:
```
/iframe.html?id=typography-heading--playground&args=as:h1;weight:bolder&viewMode=story
```

## Debugging

To debug failing tests:

1. Run tests in UI mode: `pnpm test:visual:ui`
2. View the test reporter: `pnpm playwright show-report`
3. Check the `test-results/` directory for failure screenshots
4. Compare actual vs expected in the HTML report

## Updating Snapshots

When making intentional visual changes:

```bash
pnpm test:visual:update
```

This updates all baseline screenshots. Review changes carefully before committing.

## Best Practices

* Run tests locally before committing
* Review snapshot diffs in the HTML report
* Update snapshots only for intentional changes
* Keep test names descriptive
* Use consistent story args format
* Test critical visual properties systematically
