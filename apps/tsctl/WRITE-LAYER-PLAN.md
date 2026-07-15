# tsctl write layer — design plan

**Goal.** Let the AI edit EDS tokens in the Tokens Studio project *safely, on my behalf*, with the
change history living in git so it correlates with the repo — and with enough guardrails that we
**cannot accidentally overwrite or destroy** existing tokens (which would sever Figma variable
connections and mint new UUIDs).

Grounded in the write-endpoint facts verified live on 2026-07-03 (`API-NOTES.md §6`, `PROBE-PLAN.md`).
Auth is the User JWT (`login.mts`); the SAT is not used.

## 1. The model — declarative, git-backed, branch-first (GitOps for tokens)

Not imperative "AI pokes the live API per edit." Instead the **Terraform/GitOps pattern**:

```
live project ──pull──▶ repo files (desired state, git-tracked)
                          │  ← AI edits these; git diff = the change, reviewed as a PR
                          ▼
                        plan  (diff desired vs live → ordered op list, no writes)
                          ▼
                        apply (execute ops on a SCRATCH BRANCH, never main)
                          ▼
                     review in Tokens Studio  →  merge (explicit human go-ahead)
```

Why declarative:
- **Git is the audit log and restore path.** Every token change is a normal diff/PR, tied to repo
  history — this is the "correlate with our repo" requirement, for free.
- **`plan` before `apply`** means nothing is written until a human-readable diff is reviewed.
- **Idempotent + drift-aware** — re-running `apply` on unchanged desired state is a no-op, and if
  the live project drifted since `plan`, apply aborts instead of clobbering.

Imperative escape hatch exists (`set` / `rm` single-token), but it still routes through a branch +
plan preview — see §3.

## 2. Repo representation (what lives in git)

A `tokens-project/` directory (final location TBD — see §7):

| File / dir | Purpose | Git-tracked |
|---|---|---|
| `snapshot.json` | Exact API pull (JSON:API, **includes every UUID** + Figma extensions). The machine baseline for diffing and drift detection. | ✅ |
| `sets/<set>.json` | Editable desired-state per token set, DTCG-ish. **The files the AI edits.** | ✅ |
| `id-map.json` | `"<set>/<token-name>" → uuid`. The load-bearing map that lets `apply` **PATCH by UUID** instead of recreating. | ✅ |
| `theme-options.json` | `selected_token_sets` maps per theme option (density/font/colour modes). | ✅ |
| `.tsctl-state.json` | Last-applied snapshot hash, current scratch branch, protected-id list. | ✅ |

**UUID preservation is the whole game.** Editing a token = look up its UUID in `id-map.json` →
`PATCH …/tokens/:id`. A token with no UUID = a create. This is why we never re-import wholesale.

## 3. Command surface

All commands print a one-line **DOES / DOES NOT** banner on `--help`. Writes default to **dry-run**;
live mutation needs an explicit flag. Read/local-only commands are safe to run unattended.

### Read / local-only (safe, no live writes)

**`pull [--branch <id>]`**
- DOES: fetch sets + tokens + theme options from live, write `snapshot.json`, `sets/*.json`,
  `id-map.json`, `theme-options.json`. Optionally `--commit` to git-commit the snapshot.
- DOES NOT: modify the live project; touch anything but the local `tokens-project/` files.

**`status`**
- DOES: diff local desired-state vs `snapshot.json` (and optionally re-pull to compare vs live),
  print added/changed/deleted counts per set — like `git status`.
- DOES NOT: write anything (local or live).

**`plan [--out plan.json]`**
- DOES: compute the ordered op list to reconcile **live → desired** (creates, PATCHes, deletes);
  classify each op; flag destructive ones (deletes, protected-set touches); write `plan.json`.
- DOES NOT: touch the live project. It is always dry-run. No branch is created.

**`diff <branch-id>`**
- DOES: print `GET …/branches/:id/review/changes` (the server-side plan-diff) for a branch.
- DOES NOT: write anything.

### Live writes (guarded — see §4)

**`apply [plan.json] --branch <name> [--yes]`**
- DOES: (1) re-pull live and verify it still matches the snapshot the plan was built on (**drift
  check** — abort if changed); (2) create/reuse the named **scratch branch**; (3) auto-snapshot
  (pull + git commit) as a restore point; (4) execute the plan via batch ops, **PATCH-over-recreate
  so UUIDs survive**; (5) verify post-apply (counts + `review/changes`), print the branch and its
  review link.
- DOES NOT: write to `main` or any protected branch (hard refusal); execute without a `plan.json`;
  execute deletes without `--allow-delete`; merge; run live without `--yes` (dry-run prints ops and
  stops).

**`set <set>/<name> <value> [--type T] --branch <name>`** / **`rm <set>/<name> --branch <name>`**
- DOES: imperative single-token create/update (`set`) or delete (`rm`), on a scratch branch, after
  printing the one-op plan. `set` PATCHes by UUID when the token exists.
- DOES NOT: target main/protected branches; delete without confirmation; batch (use `plan`/`apply`).

**`branch <list|new|archive> [name]`**
- DOES: list branches, create a scratch branch, archive one.
- DOES NOT: archive `main` or a protected branch; merge.

**`merge <branch-id> --yes` (highest risk — AI never runs without explicit in-chat approval)**
- DOES: show `merge_preview`; refuse if conflicts/uniqueness violations; snapshot main; require an
  interactive typed confirmation **and** `--yes`; then merge the branch to main.
- DOES NOT: merge with unresolved conflicts; run unattended; be invoked by the AI autonomously.
  ⚠️ The merge endpoint itself is **not yet verified live** (PROBE-PLAN Stage 8, deferred) — verify
  on a throwaway branch before this command is trusted.

**`restore <snapshot-ref> --branch <name>`**
- DOES: compute the **delta** from live back to a past git-committed snapshot and apply it as
  minimal batch ops on a branch (create/patch/delete to reach the old state).
- DOES NOT: nuke-and-reimport (that would mint new UUIDs and sever Figma links); write main.

## 4. Security — baked in, defense in depth

Layered so no single mistake overwrites or destroys tokens:

1. **Branch-first, always.** Only `merge` writes main. Every other live write requires a
   `change_set_id` that is **not** in the protected set. `apply`/`set`/`rm` hard-refuse if the
   target resolves to `main` (`f5d7e80d…`) or `add-semantic-color` (`fbe1da69…`).
2. **Protected-branch + protected-set allowlist** (`.tsctl-state.json`): main and Edvard's colour
   branch are never writable; token sets are read-only unless explicitly listed as AI-writable.
   Published semantic layer is protected by default (touching it forces consumer refactors).
3. **Dry-run by default.** No live write happens without an explicit `--yes` (and, for `merge`, a
   typed confirmation too).
4. **Plan/apply separation + drift check.** `apply` consumes a reviewed `plan.json` and re-validates
   it against freshly-pulled live; if anyone edited the project since `plan`, it aborts. Prevents
   clobbering concurrent work.
5. **PATCH-over-recreate (UUID preservation).** Edits always PATCH by UUID; the engine refuses to
   "change" a token by delete+create. Figma variable connections survive. (Verified: PATCH keeps the
   UUID; API-NOTES §6g.)
6. **Destructive-op guardrails.** Deletes require `--allow-delete`; a plan that would delete or
   recreate more than a configurable threshold (e.g. >5 tokens) requires an extra explicit
   confirmation naming the count. Deletion is treated as high-risk (severs Figma links).
7. **Auto-snapshot before every mutation.** `apply`/`merge`/`restore` pull + git-commit first, so
   there is always a git restore point; `restore` uses it. Snapshots are the backup, not releases.
8. **Post-apply verification.** After writing, re-count and read `review/changes`; if the result
   doesn't match the plan, stop and report — never attempt repair writes.
9. **Isolation = cheap rollback.** A bad `apply` lives only on a scratch branch → just archive it;
   main is untouched. This is the ultimate safety net.
10. **AI-conduct rules (encoded in tsctl/CLAUDE.md):** the AI may run `pull`/`status`/`plan`/`diff`
    and `apply` to a scratch branch; it must **never** run `merge` without the user's explicit in-chat
    go-ahead, and must surface the `plan` diff before any `apply`.

## 5. Known constraints (from live verification)

- **Token-SET creation is broken (500 for every payload).** So `apply` can add/patch/delete *tokens*
  in existing sets, but **cannot create new sets** yet — the colour import (which needs new sets)
  is blocked on a Tokens Studio fix or the real mechanism (API-NOTES §6i). `plan` must detect a
  "needs new set" op and refuse with a clear message rather than 500 mid-apply.
- **Merge endpoint unverified** (Stage 8). `merge` is designed but must be proven on a throwaway
  branch (empty-merge + id-across-merge) before use.

## 6. Build phases

1. **Phase 1 — read/local only:** `pull`, `status`, `plan`, `diff`. Zero live-write risk, immediate
   value (I can propose token changes as a reviewable diff today). **✅ BUILT 2026-07-03** —
   `src/sync.ts`, wired into `bin/tsctl`; verified against live (288 tokens, create/update/delete
   detection, pull-clobber guard). Local state in `tsctl/tokens-project/`.
2. **Phase 2 — guarded apply:** `apply` + `set`/`rm` + `branch`, all scratch-branch-scoped,
   dry-run default, with §4 guards 1–9. **✅ BUILT 2026-07-03** — `bin/tsw` (`src/write-cli.ts`,
   `apply.ts`, `write-client.ts`, `guards.ts`). Verified live end-to-end: dry-run → drift-check →
   snapshot → branch create → PATCH-by-UUID → verify; UUID stable, main untouched, branch archived.
   All guards fired in testing (un-allowed set, protected branch, delete-without-flag, dry-run).
3. **Phase 3 — merge/restore:** after verifying the merge endpoint (Stage 8). Highest guards.
   - **`restore` ✅ BUILT 2026-07-03** (`tsctl snapshot`/`snapshots` + `tsw restore`). Delta-based
     rollback on a scratch branch: revert (PATCH-by-uuid), recreate deleted-since (new uuid, warned),
     delete added-since. Dry-run default; snapshots live first. Verified live on a scratch branch
     (update + resurrect applied; main untouched; branch archived).
   - **`merge` DEFERRED (by choice).** Endpoint verified (Stage 8) but the command is intentionally
     not built — merging stays a human checkpoint in the Tokens Studio UI. Add later if wanted.
   - Guard-ordering improvement (both `apply` and `restore`): dry-run always previews the plan;
     allow-set/allow-delete/threshold guards are enforced only on real (`--yes`) execution.

Each phase reuses `src/client.ts` (extended with a `POST/PATCH/DELETE` sibling that hard-enforces the
protected-branch check) and `src/user-auth.ts`. Writes never live in `bin/tsctl`'s read-only router —
they get their own guarded entry point.

## 7. Open decisions (need your call)

1. **Where does `tokens-project/` live?** *Decided 2026-07-03: **local, here** (`tsctl/tokens-project/`)
   for testing.* Revisit later — likely move to the tokens/design-system repo for real PR review + CI
   once the flow is proven.
2. **Editable file format:** raw JSON:API-ish (closest to live, ids inline) vs DTCG/Tokens-Studio
   nested JSON (familiar, but needs the id-map). *Recommend: DTCG files + `id-map.json` sidecar.*
3. **Default AI-writable sets:** which sets may I edit without you flipping an allow flag? *Recommend:
   start with none writable by default — you opt each set in.*
4. **Binary shape:** write commands as `tsctl <verb>` subcommands (shared binary, read stays
   read-only-routed) vs a separate `tsw` binary. *Recommend: subcommands, with writes behind a
   guarded router.*
5. **Merge policy:** should `apply` ever auto-open a merge preview, or is merge always fully manual?
   *Recommend: fully manual, AI never merges.*
```
