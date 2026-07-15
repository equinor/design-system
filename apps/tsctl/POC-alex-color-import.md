# POC — Figma → Tokens Studio colour import via the CLI + AI

**Date:** 2026-07-03 · **Status:** proof of concept, lives on a branch (not merged)

## Goal

Prove the loop: **a loose colour export from Figma → AI reads and maps it → the guarded
`tsctl`/`tsw` CLI lands it on an isolated branch**, main safe throughout. "Get ideas from Figma into
Tokens Studio and leverage AI."

## Input

`Mode 1.tokens.json` (this folder) — an export of Alex's WIP colour system in Figma. 72 semantic
colour tokens (light mode): `background.*`, `border.*`, `icon.*`, `text.*`, `status.*`, `overlay.*`.
Each leaf carries a resolved hex **and** a `com.figma.aliasData.targetVariableName` pointing at a
primitive (`"Light/Gray/14"`, set `Primitive`) or theme colour (`"Orange/8"`, set `Theme`).

## The mapping (colour name + number → scheme scale)

Our colour architecture: `color/*` (raw hex primitives) → `scheme/*` (semantic scales) →
`semantic` (usage layer: `bg.*`/`border.*`/`text.*`). Alex's tokens are the **same usage layer**, so
they map into the `semantic` set, valued as references to our scheme scales.

Each scheme scale ties 1:1 to a primitive family (derived from `scheme/light` itself):

| primitive family | scheme scale |
|---|---|
| gray | `neutral` |
| moss-green | `accent` |
| red | `danger` |
| blue | `info` |
| green | `success` |
| orange | `warning` |

So `targetVariableName` → scheme reference:
`Light/Gray/14` → `{neutral.14}` · `Light/Moss Green/11` → `{accent.11}` · `Orange/8` → `{warning.8}`.

Coverage of the 72:
- **54** mapped directly to a scheme reference.
- **4** used gray half-steps (`1b`/`6b`) our scales don't have → mapped to the **nearest base step**
  (`1b`→`neutral.1`, `6b`→`neutral.6`), per instruction.
- **14** (`status.*`, `border.focus`, `overlay.scrim`) had **no `targetVariableName`** and a
  placeholder value in the export → imported as **raw `#000000`**. These need real targets from Alex.

## How it was done (all through the CLI)

1. `tsctl pull` — snapshot live → local `tokens-project/` files.
2. A script mapped Alex's 72 tokens → scheme references (table above), **sanitizing names** (the API
   rejects spaces/braces/brackets: `icon.accent hover` → `icon.accent-hover`, `status.info 2` →
   `status.info-2`), and **replaced** the local `semantic` set's contents with the 72.
3. `tsctl plan` → 72 create + 90 delete.
4. `tsw apply --branch alex-colors-import-v2 --allow-set semantic --allow-delete --force-destructive --yes`
   → drift-check → snapshot live → create branch → execute → verify (`review/changes` = 162).

## Result

- **Branch `alex-colors-import-v2`** (`9e2cd222-bc8f-4783-9890-d182ca44e973`, based on main).
- `semantic` set on the branch: **old 90 deleted, Alex's 72 created**. Sample:
  `background.container.sheet.default = {neutral.14}`, `icon.accent-hover = {accent.14}`.
- **Main untouched** (semantic still 90). Not merged — merge is the human checkpoint in the TS UI.

## Gotchas surfaced (useful for the real import later)

- **Token names can't contain spaces/braces/brackets** (422) — Alex's export has spaced names; must
  sanitize. See [API-NOTES](API-NOTES.md).
- **Duplicate branch names 500** on create (even vs an archived branch) — use a fresh name.
- The first attempt half-applied then failed on a spaced name; creates run before deletes, so the
  branch had partial creates + intact originals — archived it, redid on a clean branch. No data lost.
- `color/light` primitives are themselves references (not raw hex), so nearest-by-hex matching for
  half-steps wasn't reliable → used the base integer step instead.

## What it proves

The full path works and is safe: **Figma export → AI mapping → guarded, branch-scoped write**, with
main protected, every mutation UUID-preserving, and the whole thing reversible (archive the branch).
This validates the token-redefinition tooling direction (see [WRITE-LAYER-PLAN](WRITE-LAYER-PLAN.md),
[PROBE-PLAN](PROBE-PLAN.md)).

## Follow-ups (not done)

- Get real `targetVariableName`s from Alex for the 14 `status.*`/no-target tokens (currently black).
- Decide the destination naming (Alex's `background.*` convention vs our `bg.*`) and whether this
  replaces the `semantic` set for real.
- `scheme/dark` / dark-mode equivalent (Mode 1 is light only).

## Update — 2026-07-07: second import run (branch `new-color-schema`)

Re-ran the loop on an updated Figma export (`default.tokens.json`), now reproducibly via
**`build-semantic-schema.mts`** (flatten → family→role map → name-sanitize; deterministic).

- **Replaced the `semantic` set** on branch `new-color-schema` (`10070482-…`): **59 create + 90
  delete** (149 `review/changes`), main untouched. All 59 resolve cleanly (no orphaned `?` states).
- **Reference target = scheme roles** (`{neutral.N}`/`{accent.N}`/`{info.N}`/`{warning.N}`), keeping
  the semantic layer mode-free. Palette / `input/*` left untouched (already defined).
- **Raw exceptions:** `border.focus`, `overlay.scrim` kept literal (no scheme target); the 12
  `#000000` `status.*` placeholders skipped (still need real targets from Alex).
- **Then decided to drop the `concept` set** and point `border.focus` at the scheme's `border-focus`
  (handled manually in the UI). Concept was NOT redundant with the new semantic — it carried distinct
  concepts (backdrop/floating/input/link) and different disabled/focus values.
- **Tooling lessons** (now in `CLAUDE.md` → Recipes & gotchas): iterating on an existing branch needs
  `pull --branch … --force` + `tsw set/rm` (not a second `apply`); `--count`/`--set` are broken (use
  `jq`); the branch is mutable out-of-band (re-pull before editing).
