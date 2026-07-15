# Plan — carry `extensions` (Figma scopes + `hiddenFromPublishing`) through the sync/write layer

**Status:** ✅ **IMPLEMENTED & verified 2026-07-07** (`src/sync.ts`, `src/apply.ts`, `src/write-cli.ts`).
**Depends on:** verified live that token writes accept `extensions` (API-NOTES §6g; probe branch
`probe-scopes`, archived).

**Verification results:** fresh `pull` writes `$extensions` for scoped tokens (corner-radius →
`CORNER_RADIUS`, etc.); immediate `plan` = **0 ops** (normalization holds); editing one token's
`$extensions` → plan shows exactly that one diff; `apply` to throwaway branch `scope-verify`
persisted `{scopes:["CORNER_RADIUS","STROKE_FLOAT"], hidden:true}` (main unchanged), branch archived;
`tsw set --scopes A,B --hidden` dry-run builds the right body. One caveat surfaced: `review/changes`
under-reports extensions-only changes as 0 (verify with GET/diff, not the apply count). Remaining
follow-ups below (`restore`, scope validation) are **not** done — the mechanism ships; the colour
scope data-pass is separate.

## Why

Figma variable **scopes** and **`hiddenFromPublishing`** live on each token at
`extensions["com.figma"]`. They are **authored per token, not derived from type** (same `dimension`
type → `WIDTH_HEIGHT,GAP` for spacing vs `CORNER_RADIUS` for radius), so they're a real, independent
setting. The REST API accepts `extensions` on **create**, **PATCH**, and **`batch_update`** (all
verified 2026-07-07, `hiddenFromPublishing` round-trips too). But the CLI can't set them: the write
bodies only send `name/type/value/token_set_id` (+ `value/type/description` on batch), and `pull`'s
editable set files drop `extensions` entirely. Tokens created by `tsw` therefore carry no scopes →
default to **ALL_SCOPES** in Figma. This plan closes that gap so scopes become a reviewable,
branch-scoped part of the normal `pull → edit → plan → apply` flow.

Head start: `fetchLive` **already** captures `extensions` into `snapshot.json`
(`TokenRec.extensions`, `sync.ts:56`/`:225`). Only the *editable* layer and the *write bodies* drop it.

## Design decisions

- **Store the raw shape** in set files under a `$extensions` key (DTCG convention):
  `"$extensions": { "com.figma": { "scopes": ["TEXT_FILL"], "hiddenFromPublishing": true } }`.
  Faithful pass-through — no lossy transform; matches what the API stores.
- **Replace, not merge** (the probe's open caveat): `pull` writes the **full** `$extensions` object
  into the file and `apply` sends it back whole, so editing + applying can't accidentally drop a
  sibling key like `hiddenFromPublishing`. This sidesteps the merge-vs-replace ambiguity entirely.
- **Normalize empties** to avoid spurious diffs: treat `undefined` / `null` / `{}` /
  `{"com.figma":{}}` as "no extensions." **Critical** — without it, the first `pull → plan` after
  this ships would flag ~every token as an update (files omit `$extensions` while live has `{}`/`null`).

## Changes by file

### `src/sync.ts`
1. `DesiredToken` (`:74`) — add `$extensions?: unknown`.
2. `pull` per-set write (`:275`) — set `$extensions: t.extensions` **only when non-empty** (via the
   normalizer) so clean tokens stay uncluttered.
3. `computeDiff` (`:167‑179`) — add `extDiffer(live.extensions, d.$extensions)` (normalized compare)
   to the update trigger; include `$extensions` in the `before` object (`:177`); `after: d` already
   carries it.
4. `Op.before` (`:138`) — widen to carry `$extensions`; add it to the delete-op `before` (`:190`, harmless).
5. `plan` printer — include an `extensions:` line in the human diff when it changed, so scope changes
   are visible in review.
6. Add a small `normExt()` helper (empty → `undefined`) used by both `pull` and `computeDiff`.

### `src/apply.ts`
7. `PlanOp.before/after` type (`:124‑127`) — add `$extensions`.
8. Create body (`:93`) — add `extensions: op.after!.$extensions` when present.
9. `batch_update` `changes` (`:99‑107`) — `if (extDiffer(before, after)) changes.extensions = after.$extensions`.
10. `setToken` (`:~248‑290`) — thread `$extensions` into both its create body and its PATCH body.
11. `driftCheck` (optional, low priority) — add `extensions` to the `before` comparison so a
    concurrent scope edit is caught as drift.

### `src/write-cli.ts` (optional convenience)
12. Add `tsw set` flags `--scopes <a,b,c>` and `--hidden`/`--no-hidden` that build `$extensions` for a
    single token without hand-editing a file. Nice-to-have; the declarative flow (edit `$extensions`
    in the set file → `plan` → `apply`) is the primary path and works without this.

## Edge cases / gotchas

- **Normalization** (above) — the make-or-break detail; verify a clean `pull → plan` reports
  **0 updates** after the change ships.
- **PATCH replaces the `com.figma` object** — documented; the full-object round-trip makes it safe.
- **Optional scope validation** — warn (don't block) if a scope isn't in the known Figma vocabulary
  (`ALL_SCOPES`, `TEXT_FILL`, `FRAME_FILL`, `SHAPE_FILL`, `STROKE_COLOR`, `EFFECT_COLOR`,
  `WIDTH_HEIGHT`, `GAP`, `CORNER_RADIUS`, `FONT_SIZE`, `LINE_HEIGHT`, …). The API accepted arbitrary
  strings in the probe, so Figma is the real validator.
- **Out of scope for the first cut:** `restore` reverting scopes (it computes its own delta — a
  follow-up), and the `tsw set` flags if we want to ship minimal.

## Verification (on a scratch branch, reversible)

1. `pull` → confirm `sets/*.json` now carry `$extensions` for tokens that have scopes (e.g.
   `density/*` corner-radius), and clean tokens don't.
2. **No-op check:** immediately `plan` → must report **0 updates** (proves normalization).
3. Edit one token's `$extensions` (e.g. give a `text.*` colour `{"com.figma":{"scopes":["TEXT_FILL"]}}`),
   `plan` → shows exactly that one update with the extensions diff.
4. `tsw apply --branch scopes-test --allow-set semantic --yes` → GET-back confirms scopes persisted;
   `diff` shows 1 change.
5. Confirm main untouched; archive the branch.

## Rollout

Ships the **mechanism** only. Actually assigning scopes to the colour tokens (`text.*` → `TEXT_FILL`,
`background.*` → `FRAME_FILL`/`SHAPE_FILL`, `border.*` → `STROKE_COLOR`, etc.) is a **separate** data
pass once the scope→role mapping is confirmed — do it as its own reviewed branch after this lands.

## References

- API capability: `API-NOTES.md` §6g (extensions writable — create/PATCH/batch_update).
- Tooling gap + scopes-are-authored: `QUIRKS.md` (group D).
- Write-layer architecture this extends: `WRITE-LAYER-PLAN.md`, `README.md` (Architecture & code paths).
