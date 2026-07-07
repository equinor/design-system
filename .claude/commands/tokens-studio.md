# Tokens Studio Pipeline Assistant

Help with the Tokens Studio platform and `studio` CLI task described in **$ARGUMENTS** — pulling tokens, export configurations, `.studio.json`, auth, branches/releases, or building the new token pipeline.

> **Canonical reference:** [`documentation/agent-instructions/TOKENS_STUDIO.md`](../../documentation/agent-instructions/TOKENS_STUDIO.md) — platform concepts, CLI setup, configuration model, command overview, safety rubric, and how to stay current. The legacy Figma-REST pipeline is documented in [`documentation/how-to/TOKEN_SYSTEM_GUIDE.md`](../../documentation/how-to/TOKEN_SYSTEM_GUIDE.md).

@../../documentation/agent-instructions/TOKENS_STUDIO.md

## Steps

1. Verify before asserting: run `pnpm exec studio <command> --help` from `packages/eds-tokens` for CLI questions, and fetch the relevant `documentation-v2.tokens.studio` page for platform questions — do not answer from memory alone.
2. Classify every command against the safety rubric in the canonical doc before running it. Ask the user before anything that mutates remote state (`exports create/update/delete`, `config remove --delete-files`). `studio auth login` is interactive — the user runs it themselves.
3. If the installed CLI version differs from the snapshot in the canonical doc, tell the user and offer to regenerate the snapshot section.

If `$ARGUMENTS` is empty, ask what the user wants to do with Tokens Studio before proceeding.
