# Generated token output — do not edit

Everything in this directory is written by the Tokens Studio release
workflow (`.github/workflows/tokens_studio_release.yaml`) and committed
through its automated pull requests. **Never edit these files by hand** —
the next release run regenerates them and silently overwrites manual
changes. Fix token values in Tokens Studio instead.

| Directory  | Content                                | Produced by                                     |
| ---------- | -------------------------------------- | ----------------------------------------------- |
| `<alias>/` | Raw token sets (JSON, with `{alias}`s) | `studio tokens pull` (sources in `.studio.json`) |
| `css/`     | CSS custom properties                  | `studio exports run` (EDS-CSS configuration)    |
| `dtcg/`    | DTCG interchange JSON                  | `studio exports run` (EDS-DTCG configuration)   |
| `ts/`      | TypeScript modules                     | `pnpm run generate:ts-tokens` (combines `dtcg/` + `css/`) |

Two files in this directory are **not** pipeline-generated — they are owned
by release-please, which uses this directory as the root of the
`eds-tokens-next` beta release component (see
`.github/release-please-config.json`):

| File           | Owner                                                    |
| -------------- | -------------------------------------------------------- |
| `version.txt`  | release-please (current `3.0.0-beta.N` beta version)     |
| `CHANGELOG.md` | release-please (beta release notes)                      |

The generated output is published only on the beta line
(`@equinor/eds-tokens@beta`, injected at publish time by
`.github/workflows/publish_tokens.yaml`) — the stable package's `exports`
map still serves the legacy Style Dictionary build in `build/`.

Pipeline documentation: [`documentation/agent-instructions/TOKENS_STUDIO.md`](../../../../documentation/agent-instructions/TOKENS_STUDIO.md).
