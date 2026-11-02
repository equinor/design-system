# Tests

`demo.spec.ts` runs in Chromium against a dev server on port 3100, which Playwright starts on its own.

Next.js runs only one dev server per app folder, so Playwright cannot start its own while the demo is already running (`pnpm demo:dev`). Point the tests at the running server instead:

```sh
EDS_DEMO_URL=http://localhost:3001 pnpm demo:test:e2e
```

The screenshots leave out the Next.js dev overlay (`tests/screenshot.css`). After a hot reload it can show an issue badge in the corner of the page, and that badge is development tooling, not part of the demo.

| Group     | What it checks                                                                                                                                               |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Tokens    | The page renders light and comfortable by default, the colour tokens resolve, and Inter is loaded under the family name `--eds-font-family-ui` resolves to   |
| Toolbar   | Switching the colour scheme sets `data-color-scheme` on `<html>` and survives a reload, switching density changes the spacing values, the exercise link works |
| Dashboard | Rows can be selected from the checkbox and from the row, and the account menu opens                                                                          |
| Visual    | Screenshots of the dashboard in light, dark, compact and relaxed, and of the exercise page                                                                   |

The test sets the colour scheme and density with the same cookies the toolbar writes, so the server renders them before the first paint.

## Screenshots

The screenshots are named after the platform they were taken on (`-chromium-darwin.png`), so they only compare on macOS. Font rendering differs between operating systems, so a run on Linux or Windows writes its own set instead of comparing against these.

After a change to the design, update the screenshots and look at every one before committing them:

```sh
pnpm --filter eds-demo run test:e2e:update
```

Equinor is loaded from the EDS CDN, so the screenshot tests need network access.
