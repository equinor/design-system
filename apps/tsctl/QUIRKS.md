# Strange things — Tokens Studio + `tsctl` quirks & surprises

A single scannable list of the counter-intuitive behaviours we've hit working the token
redefinition through the Tokens Studio v2 API, the companion plugin, and the `tsctl`/`tsw` CLI.
Each entry: **what's strange → impact → what to do**. This **consolidates** detail that lives in
`API-NOTES.md` (§ refs), `CLAUDE.md` (Recipes & gotchas), `POC-alex-color-import.md`, `PROBE-PLAN.md`,
and the parent `../CLAUDE.md` — those remain the fuller source; this is the index of "wait, that's
weird."

Last updated 2026-07-07.

---

## A. The scraped docs & the API disagree

- **The scraped `../docs/` are unreliable on auth/transport/shape.** They read as idealized/AI-generated
  and diverge from the running API. Trust `API-NOTES.md` and live probes. *(API-NOTES intro)*
- **Base URL in the docs is wrong.** `api.tokens.studio` → ENOTFOUND. Real host:
  **`api-production.tokens.studio/api/v1`**. *(§1)*
- **A raw service-account token returns 401 on everything** — it must be *exchanged* at
  `/auth/service-token/validate` (token in the **body**, not the Authorization header). *(§2)*
- **Login JWT is at `meta.token`, not the `Authorization` header** the docs claim (no such header,
  no Set-Cookie). *(§6c)*
- **OAuth device-code path is wrong** — `POST /oauth/device`, not `/oauth/device/code`; lives at the
  host root, not under `/api/v1`. *(§6d)*

## B. Auth identity is misleading

- **The SAT can't create branches.** Its scope caps at `tokens:read`/`tokens:write`; branch creation
  is a project-level `update` no SAT grants — regenerating it doesn't help. Writes use a **User JWT**. *(§6a)*
- **`GET /auth/me` returns a *user* identity even when authing with a SAT** (the SAT acts as its
  owner). Don't infer "this is a user token" from it. *(§6b)*
- **`meta.permissions` on a token reflects the owner *user*, not the credential's scope.** Effective
  capability = min(owner permission, credential scope). A red herring for "can this token write?". *(§6b)*

## C. Write API shape gotchas

- **Branch names must be sent FLAT `{ "name": "…" }`.** The nested `{ "branch": { "name": … } }`
  form is **silently ignored** — the branch is created but auto-named `branch-<hex>`. *(§6e)*
- **`batch_update` fails silently-ish:** wrong keys return **HTTP 200 with a warning**, not an error.
  Array key is `updates` (not `tokens`), item key `token_id` (not `id`), changed fields nested under
  `changes` (flat → "No valid changes specified"). *(§6g)*
- **Empty/garbage `POST /tokens` body → 400 `INTERNAL_ERROR`** — generic, no field hints. Model the
  body on a real token from a GET. *(§6g)*
- **Token-SET creation is broken: `POST /token_sets` returns 500 for *every* payload.** The route
  exists but crashes server-side. **Set deletion isn't wired either.** To "add" a set: create it in
  the web UI, then `pull`. To "remove" one: delete its tokens (an empty shell remains → drop in UI). *(§6i)*

## D. Read API / CLI surprises

- **`GET /tokens` returns tokens completely UNORDERED** — neither ASCII nor numeric (verified
  2026-07-07). So any ordering you see is imposed downstream, not stored. *(§6j)*
- **`resolved_tokens` is NOT JSON:API.** `.data` is an **object keyed by token name** → the computed
  value as a **string** (e.g. `"oklch(0.97 0 0)"`). Every other endpoint is `data:[...]`. *(§6j)*
  - **Name-collision artifact:** since it's keyed by name, if two sets define the same token name,
    only one survives in the resolved map. Display quirk, not data loss. *(CLAUDE.md)*
- **CLI `--count` and `--set` don't work.** `--count` prints the full JSON (not a number); `--set <id>`
  returns 0 — even though tokens *do* carry `attributes.token_set_id` **and** `token_set_name`. Filter
  with `jq` on those attributes instead. *(§6j, CLAUDE.md)*
- **Figma scopes are authored per token, not derived from type.** Same `dimension` type →
  `WIDTH_HEIGHT,GAP` for spacing vs `CORNER_RADIUS` for radius. They live at
  `extensions["com.figma"].scopes` (+ `hiddenFromPublishing`). Tokens created *without* extensions
  default to **ALL_SCOPES** in Figma — so the 59 colour tokens from the import are ALL_SCOPES until
  scoped. The write endpoints accept `extensions` on create/PATCH/`batch_update` (verified 2026-07-07),
  and the CLI now carries it end-to-end (`pull` writes `$extensions`, `plan`/`apply` diff it,
  `tsw set --scopes A,B --hidden`). See `EXTENSIONS-PLAN.md`. *(§6g)*
- **`apply`'s verify count (`review/changes`) does NOT count extensions-only changes.** An
  extensions-only `batch_update` persists (GET confirms) but `review/changes` reported **0 token
  change(s)** for it (verified 2026-07-07). So don't trust the apply summary count for scope-only
  edits — confirm with a `GET`/`diff` on the branch. *(§6g)*

## E. Branch / apply workflow traps

- **`apply` is one-shot main→branch.** Its `driftCheck` always re-reads **main**, and it re-creates
  every op in the plan — so **re-running `apply` on a branch that already has your tokens
  double-creates them.** Iterate instead with `pull --branch <uuid> --force` → `tsw set`/`tsw rm`
  (no driftCheck). *(CLAUDE.md)*
- **`--branch <name>` auto-creates a branch; to target an existing one pass its UUID.** A name makes
  `apply`/`set`/`rm` try to create → **duplicate name = 500** (even vs an *archived* branch — use a
  fresh name). *(CLAUDE.md, POC)*
- **`POST /branches` can 500 yet still create the branch.** Seen 2026-07-07: `apply` to a fresh name
  returned `500 VALIDATION_ERROR` on branch creation, but the branch *was* created (likely a client
  retry: first call created it, retry hit duplicate-name). The apply aborted before any token write,
  leaving an **empty** branch. Recover by applying to that branch **by UUID** (skips creation): check
  it's empty (`diff <id>` → "net-zero"), then `tsw apply --branch <uuid> …`. *(2026-07-07)*
- **~~`pull` does NOT delete local set files for sets removed live.~~ FIXED 2026-07-07.** Previously,
  after a set was deleted on the server (e.g. `concept`), a stale `sets/<name>.json` lingered
  locally; `readDesired` treated its tokens as *desired* → `plan` showed spurious **creates** and
  marked the plan **blocked**. `pull` now **prunes** local set files (and empty dirs) not present in
  the snapshot, so it truly mirrors the branch (reports `pruned N stale local set file(s)`).
  *(fix in `sync.ts` `pull()`)*
- **The branch is mutable out-of-band.** A token's value changed in the web UI *between* an `apply`
  and the next `pull` this session (`border.focus`: `#5e9ed6` → `{border.focus}`). Re-`pull --branch`
  before editing; treat `diff <branch>` (`review/changes`) as the source of truth. *(CLAUDE.md, 2026-07-07)*
- **Good surprise — UUIDs are stable.** Branching does **not** re-mint token UUIDs, and **merge
  doesn't either** — the no-new-UUIDs / Figma-link guarantee holds across create-on-branch →
  merge-to-main. *(§6e, §6h)*

## F. Naming & references

- **Token names can't contain spaces / braces / brackets → 422.** Sanitize (spaces → hyphens) before
  writing. *(POC, CLAUDE.md)*
- **References are bare `{name.path}` strings** — no ids, no `aliasData`. They resolve **by name across
  enabled sets**, so cross-set name collisions are real (see the `resolved` collision above). *(CLAUDE.md)*

## G. Companion plugin → Figma push

- **Numeric steps sort ASCII in Figma (`1, 10, 11…2`), not numerically.** The API is unordered and the
  Tokens Studio *platform* UI natural-sorts the same data correctly — so the ASCII order is imposed on
  the **companion's push path**, most likely the companion's variable-creation order (not an inherent
  Figma limit; unconfirmed against companion source, which isn't local). **Fix:** raise with Tokens
  Studio (the companion should natural-sort like the platform), or zero-pad step names (`01`–`15`) at
  the cost of a cascading rename + padded consumer names. *(2026-07-07)*
- **CSS exports are unitless** (Figma has no units) → bulk regex-append `px` (filter by type = number,
  don't touch references). *(../CLAUDE.md)*
- **Corner-radius:** set the token type to **border-radius**; use `9999` for a pill — **avoid
  `1e10`-style values, Figma outputs them wrong.** *(../CLAUDE.md)*
- **Typography styles import is flaky** — name-vs-ID mapping, broken refs, spurious `font size 0`. *(../CLAUDE.md)*
- **Cross-file referencing breaks under modes → `?` / "zombie" states.** This is *why* the foundation
  is merged into one library file. Any mode-free semantic token aliasing a mode-bearing collection
  must be checked to survive the round-trip without orphaned `?` states (the ADR-0006 open risk). *(../CLAUDE.md, ADR-0006)*

## H. Plan / environment

- **There is no plan token limit.** A "1,000-token limit" circulated in early session notes but was a transcript error — remove it on sight if it reappears in docs or reviews.
- **Project `token_count` ≠ branch token count.** The project-level aggregate read 884 while `main`
  had 288 via `GET /tokens`. Don't treat project `token_count` as the branch count. *(§6f)*
- **This harness's Bash sandbox blocks DNS** → run tsctl/tsw with `dangerouslyDisableSandbox: true`.
  `login.mts`'s interactive password prompt **can't be driven by the Bash tool** — the user runs
  `! npx tsx <abs-path>/login.mts`, or set `STUDIO_PASSWORD`. Session ~23h. *(CLAUDE.md)*
