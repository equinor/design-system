# Tests

`demo.spec.ts` runs in Chromium against the static export in `out/`, which `tests/serve.mjs` serves on port 3100. `pnpm demo:test:e2e` builds the export first.

To run the tests against a server that is already up, such as `pnpm demo:dev`, point them at it. Next.js runs only one dev server per app folder, so this is also the way to test while the demo is running:

```sh
EDS_DEMO_URL=http://localhost:3001/ pnpm --filter eds-demo exec playwright test
```

Every test opens the app in a fresh browser context, with its settings seeded in `localStorage` the way the app saves them, and waits until the frame has applied the CSS.

| Group           | What it checks                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Editor          | The app starts on the exercise. Typing CSS changes the dashboard. Exercise and Solution swap the CSS and set the URL hash. Edits survive a reload, for each mode on its own. Restart asks first and resets only the mode you are viewing. The shortcut switches mode and keeps the cursor in the same rule. Each tab shows its file where it was left, and the open file is kept after a reload. The arrow keys, Home and End move between the tabs. The frame gets the CSS of every file. Autocomplete lists published token names only |
| Token reference | Opens from the rail and stays open after a reload. Every published token from the bundle is in a group, and none is left in Other. Clicking a token puts it in the CSS at the cursor and the dashboard picks it up; a name typed inside `var(` is completed. The previews follow the dashboard's density and colour scheme. The filter narrows the list                                                                                                                                                                                  |
| Inspect         | The class names under the pointer are shown in the frame. A click opens the file with the first rule for the class and puts the cursor on it, without reaching the dashboard. Turned off, the overlay is gone and the dashboard reacts again                                                                                                                                                                                                                                                                                             |
| Strip           | The three views. The splitter resizes the frame and the editor by dragging and with the arrow keys, keeps its position after a reload, and resets on a double-click. The colour scheme changes the dashboard and the app around it but not the editor; density changes the dashboard only                                                                                                                                                                                                                                                |
| Dashboard       | Inter is loaded under the family name `--eds-font-family-ui` resolves to. Rows are selected from the checkbox and from the row, and hover fills the whole row. The account menu opens. Button icons have the label's colour in both schemes                                                                                                                                                                                                                                                                                              |
| Visual          | Screenshots of the exercise in Row and Column (with and without the token reference), and of the solution in Fullscreen in light, dark, compact and relaxed                                                                                                                                                                                                                                                                                                                                                                              |

## Screenshots

The screenshots are named after the platform they were taken on (`-chromium-darwin.png`), so they only compare on macOS. Font rendering differs between operating systems, so a run on Linux or Windows writes its own set instead of comparing against these.

After a change to the design, update the screenshots and look at every one before committing them:

```sh
pnpm --filter eds-demo run test:e2e:update
```

The screenshots leave out the Next.js dev overlay (`tests/screenshot.css`), which can show an issue badge after a hot reload when the tests run against a dev server.

Inter and Equinor are loaded from the EDS CDN, so the tests need network access.
