# Tokens Studio v2 API — field notes

Reverse-engineered by probing the live API on 2026-07-03 while building `tsctl`.
**The scraped docs in `../docs/v2-current/` are unreliable on the points below** — they
read as idealized/AI-generated and diverge from the running API in many places (base URL, SAT
exchange, response shape, login response, device-code path, permission model — see §§1–6). Trust
this file over the docs for anything auth- or transport-related, and confirm new endpoints against
live responses.

> **🚫 The concrete ids, names, and counts here are dated EVIDENCE — not current values. Do not
> reuse them.** Every project id/name, branch id/name, token-set name, token name, and count below
> is a snapshot from a specific probing session (2026-07-03 / -07-07). They exist to prove *how the
> API behaved*, not to be copied into commands — the live project has since been renamed (§6f) and
> its tokens/counts have changed. **Discover current state live every time:** project id from
> `.env` (`TS_PROJECT_ID`), set names from `tsctl sets`, token names from `tsctl tokens`, branch ids
> from `tsctl raw /projects/<id>/branches`. This shape/behaviour knowledge is durable; the specific
> values are not.

## 1. Base URL — docs are wrong

- Docs (`api/overview.html`) say: `https://api.tokens.studio/api/v1` → **does not resolve (ENOTFOUND)**.
- Real host: **`https://api-production.tokens.studio`** — this is the `STUDIO_API_URL` default
  buried in `cli/authentication.html`. The REST path prefix `/api/v1` is correct.
- So the working base URL is: **`https://api-production.tokens.studio/api/v1`**
- Infra: Rails app on Render, behind Cloudflare. `/` 301-redirects to `/admin`.

## 2. Auth — service-account tokens must be EXCHANGED, not sent raw

> **⚠️ Historical — `tsctl` no longer uses the SAT at all.** The SAT path below was
> reverse-engineered while bringing the tool up, but a service-account token can't create branches
> (§6a), so the tool authenticates purely with a **User JWT from a password login** (`login.mts`,
> see §6c). The old `src/auth.ts` SAT-exchange helper has been deleted. This section is kept only as
> a record of how the SAT exchange endpoint actually behaves.

The docs say to send a service account token (SAT) directly as `Authorization: Bearer <SAT>`.
**This is false — a raw SAT returns 401 on every endpoint** (indistinguishable from no auth;
empty-body 401).

The real flow:

1. **Exchange** the SAT for a session JWT:
   ```
   POST /api/v1/auth/service-token/validate
   Content-Type: application/json

   { "token": "<service-account-token>" }
   ```
   - The token goes in the **body** as `token`. It is NOT read from the Authorization header
     (sending it there → 400 `{"error":"Missing token"}`).
   - Wrong param names (`service_token`, `service_account_token`) → 400 `{"error":"Missing token"}`.
   - Invalid/expired token → 401 `{"error":"Invalid or expired token"}`.
2. **Use the returned session JWT** as `Authorization: Bearer <jwt>` on all subsequent requests.

(This exchange was originally implemented in `src/auth.ts` (`exchangeServiceToken`), which has since
been removed — the tool now authenticates only with the User JWT from `login.mts` / `src/user-auth.ts`.
The response looks for the session token in the `Authorization` header first, then body fields
`token` / `access_token` / `jwt` / `session_token`, incl. one level of `data.*` nesting.)

> The doc endpoint `service-token/validate` was described only as an optional "OIDC token
> exchange for CI/CD" with the token in a Bearer header — both wrong. It's the mandatory
> exchange step, body-param based.

Other auth methods: user JWT via `POST /auth/login` (`{ "user": { email, password } }`) —
**verified live 2026-07-03, see §6**; Google OAuth; OAuth 2.0 device code (`POST /oauth/device`,
**not** `/oauth/device/code` — see §6); OIDC exchange.

## 3. Response shape — JSON:API, not flat

The overview shows flat objects (`{ id, name, ... }`). Real list responses are **JSON:API**:

```json
{
  "data": [
    {
      "type": "token_sets",
      "id": "<uuid>",
      "attributes": { "name": "primitives/default", "set_type": "STATIC", "order_index": 0, ... },
      "relationships": {
        "project":    { "data": { "type": "projects",    "id": "<uuid>" } },
        "change_set": { "data": { "type": "change_sets", "id": "<uuid>" } }
      }
    }
  ]
}
```

- Collections are wrapped in `data: [...]`; each item has `type` / `id` / `attributes` /
  `relationships`. Names, values, etc. live under `attributes`, not at the top level.
- A branch is a `change_set` (the API's `change_set_id` query param = a branch id).
- `tsctl`'s `asArray()` unwraps `data`; any real consumer must read from `attributes`.

## 4. Error / status behaviour observed

- Missing/invalid auth on a real route → **401**, empty body, `content-type: text/html`
  (no `WWW-Authenticate` header). Same response whether the token is absent or wrong.
- Unknown route → **404** (so 401-vs-404 is a reliable "is this path real?" probe).
- Malformed body on `POST` endpoints → **400** with a JSON `{"error": "..."}` message.
- Rails-style headers present: `x-request-id`, `x-runtime`.

## 5. Confirmed working (read-only)

Against project `4952a007-699a-4124-a043-124e80cc28d6`:
`./bin/tsctl sets` returns the EDS foundation sets (`primitives/default`, `font/default`,
density sets, …). Auth exchange + JSON:API unwrapping both verified end-to-end.

## 6. Write access, auth escalation & permissions (verified live 2026-07-03)

Discovered while unblocking the write layer (PROBE-PLAN.md). Every point below diverges from
the scraped docs.

### 6a. SAT scope caps at `tokens:*` — it CANNOT create branches

- All write endpoints returned **403 `{"detail":"…Required permission: update?"}`** under the
  service-account token, even after "write" was enabled on it.
- Root cause found via a previously-unknown endpoint:
  **`GET /projects/:id/service_account_tokens`** — lists each SAT with `token_prefix`,
  `display_identifier` (masked), `active`/`revoked`/`expired`, `expires_at`, and crucially:
  ```json
  "max_scopes":       ["tokens:read", "tokens:write"],
  "effective_scopes": ["tokens:read", "tokens:write"],
  "scopes":           ["tokens:read", "tokens:write"]
  ```
- The SAT scope vocabulary tops out at **`tokens:read` / `tokens:write`** (the two "Read"/"Write"
  checkboxes in the UI). Creating a **branch** is a **project-level `update`** operation that no
  SAT scope grants. **Regenerating the SAT does not help** — branch/project management is simply
  outside what a service-account token can do.
- Token operations (create/update/delete *tokens*) are expected to work under `tokens:write`,
  but branch-first workflows need a different credential (see 6c).

### 6b. `meta.permissions` reflects the OWNER USER, not the token

- Every token carries inline `attributes.permissions`:
  `{ can_read, can_create, can_update, can_delete }` — on this project all `true`.
- This is a **red herring for token scope**: it reports what the token's **owner user** can do
  (a SAT has a "Token Owner" and acts as that user), not what the presented credential's scope
  allows. Effective capability = **min(owner-user permission, credential scope)**.
- Corollary: **`GET /auth/me` returns a `type: "users"` identity** (`edbj@equinor.com`) even when
  authing with a SAT — because the SAT acts on the owner's behalf. Don't infer "this is a user
  token" from `/auth/me`.

### 6c. User JWT login — the working write credential

`POST /auth/login` acts as the **full user** (all project permissions, incl. branch creation).
Response shape (docs claim the JWT is in the `Authorization` header — **false**; no such header,
no `Set-Cookie`):

```json
{
  "data": { "type": "users", "id": "<uuid>", "attributes": { … } },
  "meta": { "token": "<JWT, ~268 chars>", "refresh_token": "<~43 chars>" }
}
```

- JWT is at **`meta.token`**; refresh token at **`meta.refresh_token`**. User JWT lifetime is 24h
  (per docs; refresh via `meta.refresh_token`, mechanism not yet probed).
- `tsctl` implements this in `src/user-auth.ts` (`login`, caches to gitignored `.session.local`,
  mode 0600, ~23h) + `login.mts`. `probe.mts` prefers the cached user JWT over the SAT exchange.
- Never printed: password or JWT. The login helper reports only response **shape** (key names +
  string lengths) on failure, never values.

### 6d. OAuth 2.0 device-code — endpoint path is wrong in docs

- Docs (`api/authentication.html`) say `POST /oauth/device/code`. **Real path: `POST /oauth/device`**
  (all `/device/code`, `/device_authorization`, `/auth/device/*` variants → 404; only `/oauth/device`
  → 422). Token polling endpoint **`POST /oauth/token`** exists (400 without grant params).
- These live at the **host root, not under `/api/v1`**.
- Requires a **registered OAuth `client_id`** (422 with empty body otherwise). No self-service
  registration path found in the v2 docs — obtain the client_id from Tokens Studio. Not pursued;
  user-JWT login (6c) was the chosen path. Note the device scope vocabulary is `read_tokens
  write_tokens`, so it may hit the same branch-creation ceiling as the SAT (unverified).

> **Merge endpoint status:** VERIFIED (Stage 8, 2026-07-03) — see §6h. The earlier "unverified"
> caveats elsewhere are superseded.

### 6e. Branch creation

- **`POST /projects/:id/branches`** as the user → **201**. Body is optional: an **empty `{}`
  auto-generates** a name (`branch-<hex>`). To name it, send the name **FLAT: `{ "name": "…" }`**.
  ⚠️ The wrapped `{ "branch": { "name": "…" } }` form is **silently ignored** (still auto-names) —
  verified live 2026-07-03.
- Branch (`change_set`) object: `id` (this **is** the `change_set_id` used for `--branch` reads),
  `based_on_change_set_id` (= parent/main), `is_main`, `status` (`active`), `event_count`,
  `authored_by` (`"user"`), `created_by` `{ id, email, name }`.
- **Verified: branching does NOT re-mint token UUIDs** — all 288 main-branch token ids are
  byte-identical on a fresh branch (ID-stability check #1).

### 6f. Project object notes

- ⚠️ **Renamed since this note.** As of 2026-07-13 the live project `4952a007-…` is
  **"Equinor Design System"** (`slug: eds`) — this is the **canonical EDS token project, not a
  test sandbox**. It was **"EDS Test 3"** (`slug: eds-test-3`) when §6 was first written
  (2026-07-03); same UUID, promoted/renamed since. Treat writes accordingly.
  `base_permission: "edit"`, `visibility: PRIVATE`. `GET /projects/:id` includes a `members` array.
- Its `token_count` field reads **1053** (2026-07-13; was 884 on 2026-07-03) — a project-level
  aggregate / default-branch figure, not the main-branch token count. Get the main-branch count
  from `GET …/tokens` (`jq '.data|length'`).

### 6g. Token write operations — verified live on a scratch branch

All carry `?change_set_id=<branch>` in the **query** (same param as the read endpoints). All
verified against the archived scratch branch `1a2845f9-…`; **UUIDs never changed** across
create → patch → batch_update.

| Op | Request | Result |
|---|---|---|
| **Create** | `POST …/tokens?change_set_id=<b>` — body `{"token":{"name","type","value","token_set_id"}}` | **201**, returns the new token (JSON:API `data`) with its `id` |
| **Update** | `PATCH …/tokens/:id?change_set_id=<b>` — body `{"token":{"value":"…"}}` | **200**, **same `id`** — PATCH-over-recreate preserves the UUID |
| **Batch update** | `POST …/tokens/batch_update?change_set_id=<b>` — body `{"updates":[{"token_id":"…","changes":{…}}]}` | **200** `{updated_count, requested_count, skipped_count, warnings[]}` |
| **Delete** | `DELETE …/tokens/:id?change_set_id=<b>` | **204** No Content |

- **batch_update gotchas** (all return HTTP 200 with a warning, not an error): the array key is
  **`updates`** (not `tokens`); each item keys the token by **`token_id`** (not `id`); the fields
  to change go in a nested **`changes`** object (flat fields → `"No valid changes specified"`).
- Empty/garbage body on `POST …/tokens` → **400 `INTERNAL_ERROR`** (generic; the endpoint does not
  return a helpful field list — model the body on a real token from a GET).
- **`extensions` (incl. Figma scopes) IS writable** — verified live 2026-07-07 (branch
  `probe-scopes`, archived). All three write paths accept and persist
  `extensions["com.figma"].scopes` (e.g. `["FRAME_FILL","SHAPE_FILL"]`) **and**
  `hiddenFromPublishing`:
  - **Create:** `POST …/tokens` with `token.extensions` → GET-back confirmed persisted.
  - **Update:** `PATCH …/tokens/:id` with `token.extensions` → replaced scopes as sent.
  - **Batch:** `POST …/tokens/batch_update` with `changes.extensions` → `updated_count:1`, and
    `scopes` + `hiddenFromPublishing` round-tripped together.

  The **CLI now supports this end-to-end** (implemented 2026-07-07, `EXTENSIONS-PLAN.md`): `pull`
  writes `$extensions` into the per-set files, `computeDiff`/`plan` diff it (with empty-value
  normalization so clean tokens don't churn), `apply` sends it via create + `batch_update`, and
  `tsw set --scopes A,B --hidden` sets it for one token. ⚠️ The API **replaces** the `com.figma`
  object on PATCH (does not merge) — the CLI always sends the full `{scopes, hiddenFromPublishing}`,
  so round-tripping the whole object is safe. ⚠️ **`review/changes` does not count extensions-only
  changes** — an extensions-only `batch_update` persists (GET confirms) but the branch review count
  reads 0; verify scope edits with `GET`/`diff`, not the apply summary.

### 6h. Merge preview, branch archive, review/changes

- **`GET …/branches/:id/merge_preview?target_change_set_id=<main>`** → **200**
  `{ conflicts[], auto_resolved_conflicts[], uniqueness_violations[], summary{ total_source_events,
  total_conflicts, needs_resolution, entity_types_affected[] }, reference_map{set_id→name} }`.
  `total_source_events` counts **operations** (a create+delete of one token = 2 events) while
  `entity_types_affected` reflects the **net** change (empty when they cancel). GET-only — no merge.
- **`GET …/branches/:id/conflict_details?target_change_set_id=<main>&token_name=<name>`** — requires
  both params.
- **`GET …/branches/:id/review/changes`** → the plan-diff: `{ changes:{ tokens[], token_sets[],
  theme_groups[], theme_options[], assets[], docs[], components[] }, token_set_names{} }`. Nets
  transient changes to empty (create+delete within the branch → all arrays empty).
- **`POST …/branches/:id/archive`** (body `{}`) → **200**, branch `status: "archived"`,
  `archived_at` set, `event_count` retained. This is the scratch-branch cleanup path.
- **`POST …/branches/:id/merge`** — body `{ "target_change_set_id": "<main>" }` → **200**
  `{ success, events_copied, message }`. Merges the branch's events into the target. **Verified live
  2026-07-03 (Stage 8):** empty branch → `events_copied: 0` (main unchanged); a branch adding one
  token → `events_copied: 1`, and **the token lands on main with the SAME UUID** it had on the
  branch. **Merge does NOT re-mint UUIDs** — the no-new-UUIDs / Figma-connection guarantee holds
  across create-on-branch → merge-to-main. (Also observed in the real colour merge: all 288 prior
  main tokens kept their ids when `add-semantic-color` was merged in.)

### 6i. Token-SET creation is broken (500) — unresolved

`POST …/token_sets?change_set_id=<b>` returns **500 `INTERNAL_ERROR` for every payload tried**
(wrapped `{"token_set":{…}}`, flat `{"name",…}`, and empty `{}` alike — a 500, not a 400/422, so
the route exists but crashes server-side). Token-set creation via this endpoint is **not usable
as-is**; the colour import (which needs new sets) must find the real mechanism or raise it with
Tokens Studio. Not blocking for token CRUD. **Set deletion is likewise not wired** — to "remove" a
set, delete its tokens (an empty set shell remains; drop it in the web UI).

### 6j. Read-endpoint shapes & CLI-flag caveats (verified live 2026-07-07)

- **`GET /resolved_tokens` is NOT JSON:API.** It returns `{ "data": {…}, "meta": {…} }` where
  **`data` is an object keyed by token name** (dotted path) → the **computed value as a string**
  (`"oklch(0.97 0 0)"`, `"rgb(29 29 29 / 0.1)"`). No `data:[...]` array, no per-token `attributes`.
  Keyed by name ⇒ if two sets share a token name, only one appears (display collision, not data loss).
- **`GET /tokens` attributes carry the set:** each token's `attributes` include **`token_set_id`
  AND `token_set_name`** (plus `css_value`, `formatted_value`, `category`, `deprecated*`,
  `is_user_created`, `generated_by_generator_id`, `extensions`). Filter/count client-side on these.
- **CLI `--count` and `--set` are unreliable** (in this build): `--count` prints the full JSON on
  `sets`/`tokens`; `--set <id>` matches nothing (returns 0) despite the tokens carrying
  `token_set_id`. Use `jq` (`.data | length`, `select(.attributes.token_set_name==…)`).
- **Iterating on a branch:** `pull --branch <id>` re-baselines `snapshot.json` to that branch;
  `tsw set`/`tsw rm` then PATCH/DELETE against it with **no driftCheck** (driftCheck in `apply`
  always re-reads **main**, so a main-based `plan`+`apply` re-applied to a populated branch
  double-creates). Pass the branch **UUID** to `--branch` for `set`/`rm`/`apply` on an existing
  branch — a name triggers branch creation (duplicate-name → 500).
- **The branch is mutable out-of-band:** a token edited in the web UI changed under us between an
  `apply` and the next `pull` this session. Re-`pull --branch` before incremental edits; treat
  `review/changes` (via `diff`) as the branch's source of truth.

## Practical checklist for the next API integration

1. Base URL: `https://api-production.tokens.studio/api/v1` (override with `TS_BASE_URL` /
   `STUDIO_API_URL` if the host ever changes).
2. Auth: log in with `POST /auth/login` (body `{ "user": { email, password } }`) → read the JWT
   from `meta.token` → use it as `Bearer` (§6c). The SAT path (§2) is a dead end — it can't create
   branches (§6a).
3. Parse JSON:API: read `data[].attributes`, follow `relationships` for ids.
4. When an endpoint misbehaves, probe it (a fake token / empty body reveals the expected shape
   via the error message) — the live API is more truthful than the docs.
5. Never print the SAT or the session JWT.
