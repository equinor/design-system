# Visual Regression Testing

This project uses Playwright for visual regression testing to ensure UI consistency across changes.

## Setup

Playwright and its dependencies are already installed. If you need to reinstall browsers:

```bash
npx playwright install chromium
```

## Running Tests

### Run all visual tests

```bash
npm run test:e2e
```

### Run tests in UI mode (interactive)

```bash
npm run test:e2e:ui
```

### Update baseline screenshots

When you make intentional UI changes, update the baseline screenshots:

```bash
npm run test:e2e:update
```

## Test Coverage

The visual tests cover the following pages:

- `/static` - Static page
- `/static/exercise` - Static exercise page
- `/dynamic` - Dynamic page
- `/dynamic/exercise` - Dynamic exercise page

## How It Works

1. The first time you run the tests, Playwright will generate baseline screenshots
2. On subsequent runs, Playwright compares new screenshots against the baselines
3. If differences are detected, the test will fail and generate a diff image
4. Review the diff in the HTML report: `npx playwright show-report`

## CI/CD Integration

The tests are configured to:

- Run on Chromium only (can be extended to other browsers)
- Automatically start the dev server before running tests
- Generate an HTML report with visual diffs
- Retry failed tests up to 2 times in CI environments

## Best Practices

1. **Initial baseline creation**: Run `npm run test:e2e:update` to create initial baseline screenshots
2. **Review changes**: Always review visual diffs before updating baselines
3. **Consistent environment**: Screenshots are sensitive to browser versions and rendering engines
4. **Disable animations**: Tests automatically disable animations for consistent screenshots
