# Typography Visual Regression Testing - Implementation Summary

## Overview

I've created a comprehensive Playwright-based visual regression testing suite for the Typography components that leverages existing Storybook stories.

## Files Created

### Configuration

- **`playwright.config.ts`** - Playwright configuration for visual testing
  - Runs tests against Storybook on `localhost:9000`
  - Configured for Chromium browser
  - Auto-starts Storybook server
  - CI-optimized settings

### Test Files

- **`tests/visual/Typography.new.spec.ts`** - 50+ tests for TypographyNext component
- **`tests/visual/Heading.spec.ts`** - 40+ tests for Heading component
- **`tests/visual/Paragraph.spec.ts`** - 40+ tests for Paragraph component
- **`tests/visual/README.md`** - Documentation for running and maintaining tests
- **`tests/.gitignore`** - Ignores test artifacts

### Package Updates

- Added `@playwright/test` dependency
- Added test scripts:
  - `test:visual` - Run all visual tests
  - `test:visual:ui` - Interactive UI mode
  - `test:visual:update` - Update snapshots
  - `test:visual:report` - View HTML report

## Test Coverage

### TypographyNext (50+ tests)

✅ Font families (ui, header)
✅ All 10 text sizes (xs through 6xl)
✅ Line heights (default, squished)
✅ Font weights (lighter, normal, bolder)
✅ Letter spacing (tight, normal, wide)
✅ Baseline alignment (grid, center) with debug mode
✅ Combined property variations

### Heading (40+ tests)

✅ All heading levels (h1-h6)
✅ Font weights per level
✅ Letter spacing variations
✅ Line heights
✅ Debug mode for each level
✅ Combined properties
✅ Full "All Variants" story screenshot

### Paragraph (40+ tests)

✅ All 10 text sizes
✅ Line heights
✅ Font weights
✅ Letter spacing
✅ Debug mode for multiple sizes
✅ Combined properties
✅ Full "All Variants" story screenshot

## How It Works

1. **Storybook Integration**: Tests navigate to Storybook iframe URLs with story-specific parameters
2. **Property Combinations**: Uses query string args to set component props (e.g., `args=size:lg;weight:bolder`)
3. **Visual Snapshots**: Captures screenshots after page reaches `networkidle` state
4. **Baseline Comparison**: Compares against stored baseline images
5. **Failure Detection**: Any pixel differences trigger test failures

## Running Tests

```bash
# Install dependencies (if not done)
pnpm install

# Install Playwright browsers
pnpm exec playwright install chromium

# Run all visual tests
pnpm test:visual

# Run in UI mode for debugging
pnpm test:visual:ui

# Update snapshots after intentional changes
pnpm test:visual:update

# View test report
pnpm test:visual:report
```

## Example Test Structure

```typescript
test.describe('Paragraph Component', () => {
  test('size lg', async ({ page }) => {
    await page.goto(
      '/iframe.html?id=typography-paragraph--playground&args=size:lg&viewMode=story',
    )
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('paragraph-size-lg.png', {
      animations: 'disabled',
    })
  })
})
```

## Snapshot Storage

Baseline screenshots are stored in:

```
tests/visual/
  ├── Typography.new.spec.ts-snapshots/
  ├── Heading.spec.ts-snapshots/
  └── Paragraph.spec.ts-snapshots/
```

Each contains PNG files named by test case.

## Benefits

1. **Reuses Storybook**: No duplication - tests existing stories
2. **Comprehensive Coverage**: Tests all prop combinations systematically
3. **Visual Regression**: Catches unintended visual changes
4. **CI-Ready**: Configured for automated testing
5. **Easy Debugging**: UI mode and HTML reports
6. **Maintainable**: Tests organized by component and property

## Next Steps

To use these tests:

1. ✅ Dependencies installed
2. ✅ Test files created
3. ⏳ Run initial tests to generate baseline snapshots
4. ⏳ Commit baseline snapshots to git
5. ⏳ Add to CI pipeline

## CI Integration

The tests are configured to run in CI with:

- Retries on failure (2 retries)
- Single worker for consistency
- Automatic Storybook server management
- HTML report generation

Add to your CI workflow:

```yaml
- name: Install Playwright
  run: pnpm exec playwright install chromium --with-deps

- name: Run visual tests
  run: pnpm --filter @equinor/eds-core-react test:visual

- name: Upload test results
  if: failure()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: packages/eds-core-react/playwright-report
```

## Maintenance

When making intentional visual changes:

1. Update the component/CSS
2. Run `pnpm test:visual` to see failures
3. Review differences in HTML report
4. If correct, run `pnpm test:visual:update`
5. Commit updated snapshots

## Notes

- Tests use Chromium for consistency
- Animations are disabled for stable screenshots
- `networkidle` ensures fully loaded state
- Debug mode tests include grid overlay
- Full page screenshots for "All Variants" stories
