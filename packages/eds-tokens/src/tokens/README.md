# Generated token output — do not edit

Everything in this directory is written by the Tokens Studio release
workflow (`.github/workflows/tokens_studio_release.yaml`) and committed
through its automated pull requests. **Never edit these files by hand** —
the next release run regenerates them and silently overwrites manual
changes. Fix token values in Tokens Studio instead.

| Directory  | Content                                | Produced by                                     |
| ---------- | -------------------------------------- | ----------------------------------------------- |
| `raw/`     | Raw token sets (JSON, with `{alias}`s) | `studio pull` (the `eds` output in `.studio.json`) |
| `css/`     | CSS custom properties                  | `studio pull` (the `css` output, EDS-CSS)       |
| `dtcg/`    | DTCG interchange JSON                  | `studio pull` (the `dtcg` output, EDS-DTCG)     |
| `ts/`      | TypeScript, one file per colour scheme and density | `pnpm run build:ts-modules` (checks the TypeScript export that `studio pull` writes to the git-ignored `ts-export/` against `dtcg/`) |

The generated output is published on the beta line
(`@equinor/eds-tokens@beta`, injected at publish time by
`.github/workflows/publish_tokens.yaml` under temporary additive
`./next/{css,dtcg,ts}/*` subpaths) — the `exports` map in git still serves
the legacy Style Dictionary build in `build/`. The `next/*` subpaths last
only until the `/next` components finish migrating to the new variable
names; the output then moves to the final specifiers within the beta line —
see [ADR-0009](../../../../documentation/adr/0009-temporary-next-subpaths-for-eds-tokens-beta.md)
for the full lifecycle.

The `./next/ts/*` pattern supplies the `.ts` extension, so the specifier
carries none: `@equinor/eds-tokens/next/ts/light-comfortable`, matching the
2.x `./ts/*` patterns that `eds-mobile-components` already imports from.
Betas up to `3.0.0-beta.8` behaved the other way round and needed
`light.ts` spelled out; that is fixed from the next beta
([#5671](https://github.com/equinor/design-system/issues/5671)). The `css`
and `dtcg` patterns stay bare, because their specifiers name a file
(`next/css/variables.css`). Note that `./next/ts/*` ships raw `.ts`
modules (no compiled `.js`/`.d.ts`), so it requires a TypeScript-aware
consumer.

Pipeline documentation: [`documentation/agent-instructions/TOKENS_STUDIO.md`](../../../../documentation/agent-instructions/TOKENS_STUDIO.md).
