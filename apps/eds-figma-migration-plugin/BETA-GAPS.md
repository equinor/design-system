# Gaps in the Beta

The plugin window is a small app built on the Beta components (`/next`) and
the Beta tokens. This file records each component or token that was missing
or awkward while building it, with what the plugin does instead. Add to it as
the plugin grows.

| What                                       | Where it came up                                        | What the plugin does                                                                                                                                  |
| ------------------------------------------ | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| No typography component                    | Window title, section titles, help text                 | Plain `h1`, `h2` and `p` elements with the typography tokens in `ui.css`                                                                              |
| No radio group                             | The Page or File scope                                  | A `fieldset` with a `legend` around two `Radio` components, laid out in `ui.css`                                                                      |
| No border width token                      | Header divider, the JSON field in the developer export  | `1px` in `ui.css`                                                                                                                                     |
| No code or monospace text style            | The JSON field in the developer export                  | `--eds-font-family-mono` with the label size tokens; the Figma file has `mono/*` text styles, but the CSS bundle has no mono size tokens              |
| No table, tabs, tree, progress bar or list | Planned for the frame list, inspector and scan progress | To be built from tokens in milestones 3 to 6, and recorded here                                                                                       |
| `/next` is not in the exports map          | Building an app in the monorepo against main            | Aliases in `vite.config.ts` and `paths` in `tsconfig.json` to the build, as the docs site does. Deliberate (#4395), but every internal app repeats it |
| Fonts are not part of a package            | Loading Equinor and Inter                               | The stylesheet from `cdn.eds.equinor.com`, declared under `networkAccess` in the manifest                                                             |
