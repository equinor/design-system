# EDS variable migration (Figma plugin)

A Figma plugin that finds layers bound to variables from the deprecated EDS
libraries and swaps them for variables and text styles from
**EDS Foundation [EDS Beta]**. It applies a fixed mapping, so it runs locally
and uses no AI credits.

The plugin works on layout: the frames, text and shapes a designer built in
their own file. It never changes anything inside an instance, because a change
there becomes an instance override. An instance that still uses old variables
comes from a component that has not been updated in its library; the plugin
reports it and leaves it alone.

The mapping rules are in [`docs/mapping-rules.md`](./docs/mapping-rules.md).

## Status

| Milestone                                     | State                            |
| --------------------------------------------- | -------------------------------- |
| 1. Scaffold, manifest, build, inventory export | Done                             |
| 2. Rules and tests                            | Done                             |
| 3. Read-only scan                             | Next                             |
| 4. Mapping view and overrides                 |                                  |
| 5. Apply                                      |                                  |
| 6. Review and the remaining views             |                                  |
| 7. Report and saved health                    |                                  |
| 8. Release                                    |                                  |

## Build

The plugin is built against the workspace versions of `@equinor/eds-core-react`
and `@equinor/eds-tokens`, so build those first:

```bash
pnpm run build                                                  # at the repository root
pnpm --filter @equinor/eds-figma-migration-plugin run build     # dist/code.js and dist/ui.html
```

`pnpm --filter @equinor/eds-figma-migration-plugin run dev` rebuilds both files
on every change. Figma picks up the new files the next time the plugin runs.

The build has two parts:

- `dist/code.js`, the plugin main thread, which runs in Figma's sandbox. It is
  one IIFE compiled to ES2017 syntax (`vite.plugin.config.ts`).
- `dist/ui.html`, the plugin window, with its JavaScript and CSS inlined,
  because Figma loads the window as one HTML string (`vite.config.ts`).

## Import it into Figma

1. Build the plugin as above.
2. In the Figma desktop app, open a design file and choose **Plugins →
   Development → Import plugin from manifest…**.
3. Select `apps/eds-figma-migration-plugin/manifest.json`.
4. Run it from **Plugins → Development → EDS variable migration → Open**.

Always try the plugin on a duplicate of a frame. The test frame is
**Migration test – old EDS variables** in the AI-Testing file.

## Developer command: export the inventories

The mapping is checked against two generated files in
`src/mapping/inventory/`:

- `new-library.json`: the variables of the `semantic` collection, the text
  styles, and the mode ids of `density` and `color-scheme` in EDS Foundation
  [EDS Beta].
- `old-libraries.json`: the collection keys of the deprecated libraries.

To regenerate them, run **Plugins → Development → EDS variable migration →
Developer → Export EDS inventories**:

- in EDS Foundation [EDS Beta] for `new-library.json`, because the plugin API
  cannot list the text styles of a library from another file;
- in a file where the deprecated libraries are enabled for
  `old-libraries.json`. The API only lists published collections, so the
  unpublished ones the old variables alias through are carried over from the
  current file.

Copy or download each file, replace it in the repository, run the tests and
raise `MAPPING_VERSION` in `src/mapping/version.ts`.

## Tests

```bash
pnpm --filter @equinor/eds-figma-migration-plugin run test:run
```

- `test/answer-key.test.ts`: the 59 rows of the answer key for the test frame.
- `test/inventory.test.ts`: runs every published old variable through the
  rules in a set of contexts and checks that each target exists in EDS
  Foundation with a matching type, that a sure proposal fits the property's
  scope, and that `background/backdrop` is never proposed.

## Fonts and network access

The EDS components are set in Equinor and Inter. The plugin window loads them
from `cdn.eds.equinor.com`, which is declared in `manifest.json` under
`networkAccess`. Without network access the window falls back to the system
font; everything else works.

## Code

```
manifest.json
src/mapping/     rules, role guesses, inventories; pure, tested without Figma
src/plugin/      the main thread (code.ts) and the developer commands
src/shared/      message types between the main thread and the window
src/ui/          the plugin window, React and the EDS Beta components
docs/            mapping-rules.md, the source for the rules
test/            Vitest tests and fixtures
BETA-GAPS.md     what was missing or awkward in the Beta while building this
```
