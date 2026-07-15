# Write-endpoint verification plan (scratch-branch probes)

Goal: verify live, against the EDS Tokens Studio project, the facts the tsctl **write layer**
depends on — before building it. The design being validated: **plan/apply with branch-first
writes** (every mutation lands on a scratch branch; main only changes via an explicit,
previewed merge) + **git-committed local snapshots** as the durable restore path.

**Prime directive: token UUIDs must never change and Figma variable connections must never be
lost.** Every stage below is designed so main and the 288 existing tokens are never written to.

## State as of 2026-07-03 (what's already verified live)

Done with read-only probing — do not redo, trust these:

| Fact | Evidence |
|---|---|
| Auth: SAT → JWT via `POST /auth/service-token/validate` body `{token}` | Endpoint works, but the SAT can't create branches (§6a), so this path was dropped — the tool now uses a User JWT from `login.mts`. (Old `src/auth.ts` removed.) |
| Main has **288 tokens** (not 82 — that was the Figma-side/primitives figure) | `primitives/default` 82 · `semantic/default` 54 · `density/{compact,comfortable,relaxed}` 49×3 · `font/default` 5 |
| `GET /branches` works; main is itself a branch | main = `f5d7e80d-2909-4871-998f-58b3567a6ea7`; `add-semantic-color` = `fbe1da69-e412-4bbf-aa95-cdb99673eabc` (877 tokens, Edvard's colour work — **never touch it**) |
| **Branching does NOT re-mint token UUIDs** | All 288 main token ids byte-identical on `add-semantic-color` |
| Docs' `merge-preview` / `conflict-details` paths are fake; real paths are snake_case | `merge_preview`, `conflict_details` exist (403 under read-only SAT, not 404) |
| `GET /branches/:id/review/changes` works read-only | Full added/changed diff keyed by `identity_id` — this is the "plan diff" for reviews |
| `GET /branches/:id/events` + `/history` work; paginated via `per_page` | Numbered ledger of every operation (`token_updated`, `theme_option_updated`, …) — built-in audit trail |
| Tokens carry `meta.permissions` and full `com.figma` extensions inline | Snapshot layer can capture/verify Figma scopes + hiddenFromPublishing |
| Array query params use `key[]=` encoding | `src/client.ts` already does this (`theme_options[]`) |

## ✅ RESULTS — verification complete (2026-07-03)

**All stages 0–6 passed. Prime directive held: no token UUID ever changed; main never written.**

- **Blocker resolved.** The 403 `update?` was *not* fixable on the SAT: SAT scopes cap at
  `tokens:read`/`tokens:write` and **cannot create branches** (project-level `update`). Fixed by
  switching to a **User JWT** (`login.mts` → `POST /auth/login`, JWT at `meta.token`), which acts
  as the full user and can create branches. See API-NOTES §6a–6c.
- **Branching preserves UUIDs** — 288 main ids byte-identical on the branch (checks #1 & #2).
- **Token CRUD verified branch-scoped** — create (201) / PATCH (200, **UUID stable**) /
  batch_update (200) / delete (204), all `?change_set_id=<branch>`. Shapes in API-NOTES §6g.
- **`review/changes`** nets transient create+delete to empty → validated as the plan-diff surface.
- **`merge_preview`** (GET, needs `target_change_set_id`) → conflicts/summary/reference_map. §6h.
- **Cleanup**: scratch branch `1a2845f9-…` archived. Final: main **288**, ids identical to
  baseline; `add-semantic-color` still **877**.
- **Open item**: `POST …/token_sets` returns **500 for every payload** — token-*set* creation
  unusable as-is; the colour import needs the real mechanism or a Tokens Studio fix (§6i).

Full request/response shapes recorded in **API-NOTES.md §6**. Details below are the original plan.

---

**Original blocker (resolved above):** all write endpoints returned **403 “Required permission:
update?”** under the SAT. Root cause turned out to be SAT scope, not propagation lag — see Results.

## Tooling

- `probe.mts` (this folder, temporary): `npx tsx probe.mts <METHOD> <path> [json-body]`.
  `{PID}` in the path expands to `TS_PROJECT_ID`. Prints status + body (truncated). Never prints
  secrets — keep it that way.
- `./bin/tsctl` for reads. Note: `tsctl tokens --count` without `--set` prints the full body
  instead of a count (unwrap bug) — count with `grep -c '"type": "tokens"'` instead.
- Run everything from this directory; Bash needs `dangerouslyDisableSandbox: true` for network.

## Hard rules for execution

1. **Never** issue POST/PATCH/DELETE against main-scoped data. Every token/set mutation must
   carry the scratch branch's `change_set_id`. The only branch-level writes allowed: create the
   scratch branch, archive the scratch branch.
2. **Never merge anything.** `merge_preview` is GET-only inspection. The optional merge tests at
   the end require Edvard's explicit go-ahead in the conversation, separately.
3. **Never touch** `add-semantic-color` (`fbe1da69-…`) with anything but GET.
4. Verify main against the baseline after every stage that wrote anything (cheap: one GET).
5. If any response looks like it affected main (count ≠ 288, ids differ, unexpected
   `change_set_id`), **stop immediately** and report — don't attempt repair writes.
6. Never print or log the SAT/JWT.

## Stages

### Stage 0 — preflight baseline (read-only)

```sh
./bin/tsctl tokens | grep -oE '"id": "[0-9a-f-]{36}"' | sort -u > /tmp/main-token-ids-baseline.txt
wc -l < /tmp/main-token-ids-baseline.txt   # expect 288
```
(The grep matches only JSON:API `"id":` fields = token uuids; `token_set_id` doesn't match.)

### Stage 1 — resolve the 403

```sh
npx tsx probe.mts POST "/projects/{PID}/branches" '{}'
```
- Expect **400/422** (param missing) once permissions are live. Still **403** → wait a minute,
  retry once; if it persists, stop and tell Edvard the permission toggle likely needs a
  re-issued SAT (new token value into `.env`), then retry.

### Stage 2 — empty-body existence probes (creates nothing)

For each of `branches`, `tokens`, `tokens/batch_update`, `tokens/batch_create`,
`tokens/batch_delete`, `tokens/import`, `token_sets`:
```sh
npx tsx probe.mts POST "/projects/{PID}/<path>" '{}'
```
Record status + error shape per endpoint. 400/422 = exists as documented; 404 = docs wrong
(hunt snake_case variants); anything else = note it.

### Stage 3 — scratch branch

```sh
npx tsx probe.mts POST "/projects/{PID}/branches" '{"branch":{"name":"tsctl-probe-2026-07-03"}}'
```
- Capture the new branch id (`SCRATCH`) from the response.
- Verify: `GET /branches` lists it, `based_on_change_set_id` = main's id.
- **ID-stability check #1:** tokens on `SCRATCH` vs baseline — all 288 ids identical:
  ```sh
  ./bin/tsctl tokens --branch $SCRATCH | grep -oE '"id": "[0-9a-f-]{36}"' | sort -u | comm -3 - /tmp/main-token-ids-baseline.txt
  # expect empty output
  ```

### Stage 4 — token CRUD on the scratch branch only

All requests carry `?change_set_id=$SCRATCH` (or body equivalent — probe which one the write
endpoints accept; the GETs use the query param).

1. **Create** a probe token in an existing set (e.g. `font/default`,
   set id from `./bin/tsctl sets`), name `tsctl.probe.delete-me`, type `dimension`, value `1px`.
   Record its UUID.
2. **PATCH** its value (`1px` → `2px`). **Critical check: UUID unchanged**, same id returns the
   new value on GET.
3. **batch_update** the same token (e.g. description). Confirm UUID unchanged again.
4. Confirm the 288 pre-existing ids on the branch are still identical to baseline
   (ID-stability check #2 — proves writes don't churn neighbours).
5. **DELETE** the probe token on the branch; confirm it's gone from the branch **and was never
   on main**.
6. Optionally repeat create/delete for a probe **token set** on the branch — records whether
   `token_sets` writes are branch-scoped too (needed for the colour import later).
7. Check `GET /branches/$SCRATCH/review/changes` — after the delete it should show no net token
   changes (or exactly the residue expected). This validates `review/changes` as the
   plan-diff surface.

### Stage 5 — merge preview + audit surfaces (read-only, now with update perms)

```sh
npx tsx probe.mts GET "/projects/{PID}/branches/$SCRATCH/merge_preview"
npx tsx probe.mts GET "/projects/{PID}/branches/$SCRATCH/conflict_details"
```
Record response shapes. **Do not merge.**

### Stage 6 — cleanup + final integrity check

```sh
npx tsx probe.mts POST "/projects/{PID}/branches/$SCRATCH/archive"
./bin/tsctl tokens | grep -c '"type": "tokens"'          # expect 288
./bin/tsctl tokens | grep -oE '"id": "[0-9a-f-]{36}"' | sort -u | diff - /tmp/main-token-ids-baseline.txt  # expect no diff
```
Also confirm `add-semantic-color` still shows 877 tokens.

### Stage 7 — write down what was learned

- Append a **“Write endpoints — verified live”** section to `API-NOTES.md`: per-endpoint
  status, body shapes, branch-scoping mechanism, permission model (`meta.permissions`,
  the `update?` permission string), snake_case corrections, `review/changes` / `events` /
  `history` shapes, pagination.
- Correct stale facts where they live: token count 288 (not ~82) and the token-limit nuance in
  `../CLAUDE.md` (token-studio folder) and this repo's notes.
- Delete `probe.mts` or keep it — if kept, note in `CLAUDE.md` that it can WRITE and must only
  be pointed at scratch branches.

### Stage 8 — ✅ DONE (2026-07-03, with Edvard's explicit approval)

Both tests passed against live (main was 877 by then — Edvard had merged the colour branch in).
Merge endpoint + shapes recorded in API-NOTES §6h.

- **Empty-merge test:** ✅ `POST …/branches/:id/merge` body `{target_change_set_id: <main>}` →
  `200 {success, events_copied:0}`. Main unchanged (877, ids identical).
- **ID-across-merge test:** ✅ created one probe token on a branch (uuid `31a4c340…`), merged →
  `events_copied:1`, token landed on main with the **SAME uuid**. **No-new-UUIDs guarantee holds
  across merge.** Deleted the probe from main; main back to 877, ids identical to baseline. All
  test branches archived.
- **Bonus finding:** branch names must be sent FLAT `{name}` — wrapped `{branch:{name}}` is ignored
  (API-NOTES §6e); `apply.ts branchNew` fixed accordingly.

**Phase 3 (merge/restore) is now unblocked** — the merge endpoint is proven safe.

## After verification (context for the write-layer build)

The findings feed the tsctl write layer sketched in conversation on 2026-07-03:

- `tsctl plan` — diff desired state vs live (or `review/changes` for a branch), print, no writes
- `tsctl apply` — execute the diff **on a scratch branch** via batch ops; PATCH-over-recreate
  everywhere so UUIDs survive; auto-snapshot (full pull → git commit) before apply
- `tsctl merge` — show `merge_preview`, require confirmation, snapshot main first, then merge
- `tsctl restore <snapshot>` — delta vs live applied as minimal batch ops on a branch (never
  nuke-and-reimport: recreation mints new UUIDs and severs Figma variable connections)
- Releases stay reserved for *publishing* (they trigger webhooks/CI per the docs) — they are
  not the backup mechanism

Related: pipeline rebuild [equinor/design-system#5108](https://github.com/equinor/design-system/issues/5108)
(pull-based CI via the official Studio CLI — which is pull-only, so all writes go through this
REST layer).
