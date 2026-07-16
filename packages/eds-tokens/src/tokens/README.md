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

The generated output is published on the beta line
(`@equinor/eds-tokens@beta`, injected at publish time by
`.github/workflows/publish_tokens.yaml` under temporary additive
`./next/{css,dtcg,ts}/*` subpaths) — the `exports` map in git still serves
the legacy Style Dictionary build in `build/`. Note that `./next/ts/*`
ships raw `.ts` modules (no compiled `.js`/`.d.ts`), so it requires a
TypeScript-aware consumer.

Pipeline documentation: [`documentation/agent-instructions/TOKENS_STUDIO.md`](../../../../documentation/agent-instructions/TOKENS_STUDIO.md).
