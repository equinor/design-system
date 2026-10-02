---
mode: agent
description: Help with the Tokens Studio platform and studio CLI (pull, exports, config, auth, pipeline)
---

# Tokens Studio Pipeline Assistant

> **Canonical reference:** [`documentation/agent-instructions/TOKENS_STUDIO.md`](../../documentation/agent-instructions/TOKENS_STUDIO.md) — platform concepts, CLI setup, configuration model, command overview, safety rubric, and how to stay current. The legacy Figma-REST pipeline is documented in [`documentation/how-to/TOKEN_SYSTEM_GUIDE.md`](../../documentation/how-to/TOKEN_SYSTEM_GUIDE.md).

Help with the following Tokens Studio task, following the canonical doc above: ${input:task}

## Steps

1. Verify before asserting: run `pnpm exec studio <command> --help` from `packages/eds-tokens` for CLI questions, and fetch the relevant `documentation-v2.tokens.studio` page for platform questions — do not answer from memory alone.
2. Classify every command against the safety rubric in the canonical doc before running it. Ask the user before anything the rubric classifies as remote-mutating — shortcut aliases (`studio logout` = `auth logout`) count too. `studio auth login` is interactive — the user runs it themselves.
3. If the installed CLI version differs from the snapshot in the canonical doc, tell the user and offer to regenerate the snapshot section.
