# tsctl — command reference (for the AI)

`tsctl` is a **read-only** CLI over the Tokens Studio v2 REST API. Use it to inspect the live
EDS token project from the terminal instead of guessing at state or asking the user to click
through the web app. It is safe to run against the live project: the HTTP client only ever issues
`GET` (plus one auth-exchange `POST`) — there is **no** code path that can create/update/delete.

Read `API-NOTES.md` in this folder for the underlying API facts (host, auth-exchange flow,
JSON:API shape). This file is the operational how-to.

## Before running anything

- **🚫 NEVER reuse a concrete id, name, or count from these notes — they go stale.** Every project
  id, project name, branch id/name, token-set name, token name, and token count that appears in
  `API-NOTES.md`, `PROBE-PLAN.md`, `WRITE-LAYER-PLAN.md`, `POC-alex-color-import.md`, or any example
  in this repo is a **point-in-time snapshot** from a past probing session — it is *evidence of how
  the API behaved*, not a current value. The live project has been renamed and its tokens/counts
  have changed since. **Always discover current state live before you act:**
  - project id → it's in `.env` (`TS_PROJECT_ID`); don't hardcode the UUID from the notes.
  - token-set names → `./bin/tsctl sets`
  - token names → `./bin/tsctl tokens | jq -r '.data[].attributes.name'`
  - branch ids/names → `./bin/tsctl raw /projects/<project-id>/branches`

  If you catch yourself typing a UUID, branch name, or token name you *read in a doc* rather than
  *saw in live output this session*, stop and look it up.
- **Run from this directory:** `cd .../tokens/token-studio/tsctl` first — the launcher and `.env`
  are resolved relative to it, and cwd resets between Bash calls.
- **Network + sandbox:** these commands hit the internet. In this harness the default Bash sandbox
  blocks DNS (you'll get `Network error … (ENOTFOUND)` or `fetch failed`). Run tsctl commands with
  **`dangerouslyDisableSandbox: true`**. Reaching `api-production.tokens.studio` confirms network is
  up.
- **Auth is a User JWT from a password login.** Run `npx tsx login.mts` once (prompts for the
  password, or reads `STUDIO_PASSWORD`); it caches a User JWT in `.session.local` (~23h). Both
  `bin/tsctl` and `probe.mts` read that cached JWT via `requireUserJwt()` — there is no other
  credential path (an API/service-account token can't create branches; see API-NOTES §6a). If a
  command errors with "Run `npx tsx login.mts` again", the session expired — re-run login. Never
  read or print the password or JWT — **don't** (the classifier blocks even masked slices, and the
  user has asked not to).
- **Invocation:** `./bin/tsctl <command> [flags]`.

## When to use which command

| You want to… | Command |
|---|---|
| Check auth / who the token acts as | `whoami` |
| Find the project id (or list accessible projects) | `projects` |
| See the token-set structure (primitives/font/density/semantic) | `sets` |
| Count or list actual tokens, optionally in one set or branch | `tokens` |
| See **resolved/computed** values (what a consumer actually gets) | `resolved` |
| Inspect Figma variable collections / variables | `collections`, `variables` |
| Hit any endpoint not wrapped yet | `raw <path>` |
| Snapshot live → local editable files | `pull` |
| See local edits vs live (like `git status`) | `status` |
| Build/review a change set (dry run) | `plan` |
| Show a branch's server-side diff | `diff <branch-id>` |
| Save / list durable restore points | `snapshot [--label X]` / `snapshots` |
| Roll live back to a snapshot (on a branch) | `tsw restore <snap\|latest> --branch …` |
| **Apply** a reviewed plan to a scratch branch | `tsw apply --branch … --allow-set …` |
| Create/update or delete a single token | `tsw set …` / `tsw rm …` |
| List / create / archive branches | `tsw branch list\|new\|archive` |
| Merge to main | **not built — human-only in the web UI** |

## Commands

### `whoami`
- **Endpoint:** `GET /auth/me`
- **When:** verify the token is valid / see the acting identity before doing real work.
- **Note:** unverified against live; may be user-JWT oriented. If it 401s even after exchange,
  it's an endpoint quirk, not necessarily a bad token — cross-check with `sets`.

### `projects`
- **Endpoint:** `GET /projects`
- **When:** discover/confirm the project id to put in `.env`.
- **Note:** may be limited by what the logged-in user can see. Unverified live. If it's
  empty/limited, rely on the known project id (`sets` proves access).

### `sets`  ✅ verified live
- **Endpoint:** `GET /projects/:project_id/token_sets`
- **When:** understand the set layout before querying tokens. Returns names like
  `primitives/default`, `font/default`, density sets, semantic — each item's real fields are under
  `.attributes` (JSON:API), and `.relationships.change_set` gives the branch id.
- **Flags:** `--project <id>` to override `.env`.

### `tokens`  ✅ verified live
- **Endpoint:** `GET /projects/:project_id/tokens` (query `change_set_id` for a branch)
- **When:** list tokens, or count them.
- **Flags:**
  - `--branch <change_set_id>` — read from a branch instead of main.
  - ⚠️ `--count` and `--set` are **unreliable** (see Gotchas): `--count` prints the full JSON, not a
    number; `--set <id>` returns `0`. **Do the count/filter yourself with `jq`** — token objects
    carry `attributes.token_set_id` **and** `attributes.token_set_name`:
    - count all: `./bin/tsctl tokens | jq '.data | length'`
    - count one set: `./bin/tsctl tokens | jq '[.data[]|select(.attributes.token_set_name=="semantic")]|length'`
- **Attributes present** (useful): `name`, `value`, `type`, `token_set_id`, `token_set_name`,
  `description`, `css_value`, `formatted_value`, `extensions` (Figma), `deprecated*`,
  `is_user_created`, `generated_by_generator_id`.

### `resolved`  ✅ verified live
- **Endpoint:** `GET /projects/:project_id/resolved_tokens`
- **When:** you need the **computed** value of tokens (aliases followed), e.g. validating what a
  given density/mode actually produces for a consumer — the ADR-0006 round-trip question.
- **Flags:**
  - `--branch <change_set_id>`
  - `--theme-option <id>` — **repeatable**; pass each active theme option id to resolve under a
    specific mode combination. Example: `./bin/tsctl resolved --theme-option <compact> --theme-option <dark>`
- ⚠️ **Response shape is NOT JSON:API** (unlike every other command). It's `{ data: {…}, meta: {…} }`
  where **`.data` is an OBJECT keyed by token name** (dotted path) → the computed value as a
  **string** (e.g. `"oklch(0.97 0 0)"`, `"rgb(29 29 29 / 0.1)"`). Read one with
  `jq -r '.data["background.container.canvas.default"]'`. Detect broken refs by scanning values for
  `null`/`?`/`failedToResolve`. **Name-collision caveat:** keyed by name, so if two sets define the
  same token name only one survives in the map — a display artifact, not a data problem.

### `collections`
- **Endpoint:** `GET /projects/:project_id/variable_collections`
- **When:** inspect the Figma-side variable collections (the mode-bearing collections). Unverified live.

### `variables`
- **Endpoint:** `GET /projects/:project_id/variables`
- **When:** inspect individual Figma variables and their `values_by_mode`. Unverified live.

### `raw <path>`
- **Endpoint:** whatever GET path you pass (prefixed with the base URL).
- **When:** an endpoint isn't wrapped yet, or you want to probe something ad hoc. **GET only.**
- **Example:** `./bin/tsctl raw /projects/<project-id>/token_sets/<set-id>` (use your live
  `TS_PROJECT_ID` and a set id from `./bin/tsctl sets` — never the UUID printed in these notes).

## Global flags (all commands)

- `--project <id>` — override `TS_PROJECT_ID` from `.env`.
- `--count` — **unreliable in practice** (prints full JSON on `sets`/`tokens`). Use `jq '.data | length'`.
- `--json` — pretty JSON (this is the default; the flag is a no-op reminder).
- `--help` / `help` — usage.

## Output & parsing

- Most responses are **JSON:API**: lists come back as `{ "data": [ { type, id, attributes, relationships } ] }`.
  Real values live under `.attributes`. **Exception:** `resolved` returns `.data` as a name-keyed
  object (see the `resolved` note above).
- Parse/count/filter with `jq` — don't trust `--count`/`--set`. e.g. `jq '.data | length'`,
  `jq '[.data[]|select(.attributes.token_set_name=="semantic")]'`.
- On failure the command prints `HTTP <status> <text> — GET <path>` plus the body and exits non-zero.
  `401` after exchange = genuinely bad/expired token; `404` = wrong path; network errors name the host.

## Declarative sync (`tsctl pull/status/plan/diff`) — read-only over the API

Phase 1 of the write layer (`src/sync.ts`, `WRITE-LAYER-PLAN.md`). `pull` GETs live → local
`tokens-project/` files (snapshot + editable per-set files + `id-map.json`); `status`/`plan` are
offline diffs; `diff` prints a branch's `review/changes`. **None mutate the live project.** Use this
to propose token edits as a reviewable, UUID-aware diff: `pull` → edit `sets/*.json` → `status` →
`plan`.

## ⚠️ Write-capable tooling (NOT part of the read-only CLI)

Live mutations go through these, all using the **User JWT** (run `npx tsx login.mts` first; caches
to `.session.local`, ~23h — the SAT can't create branches, API-NOTES §6a). They live outside
`bin/tsctl` so the read CLI's GET-only contract holds.

- **`bin/tsw`** — the **guarded write CLI** (Phase 2: `src/write-cli.ts`/`apply.ts`/`write-client.ts`/
  `guards.ts`). Commands: `apply`, `set`, `rm`, `branch`. **All writes are scratch-branch-scoped and
  DRY-RUN unless `--yes`.** Structural guards: refuses main/protected branches, refuses token writes
  without a `change_set_id`, refuses sets not in `--allow-set`/`writableSets`, refuses deletes
  without `--allow-delete`. **AI conduct: you MAY run `pull`/`status`/`plan`/`diff` and `tsw apply`
  to a scratch branch after showing the plan; you must NEVER merge — merging is human-only.**
- **`login.mts`** — obtains/caches the User JWT.
- **`probe.mts`** — low-level `npx tsx probe.mts <METHOD> <path> [json-body]`; writes to whatever
  path you give it. **Rule: every token/set mutation must carry `?change_set_id=<scratch-branch>`.**
  Prefer `tsw` (guarded); use `probe.mts` only for ad-hoc endpoint work. Shapes in API-NOTES §6g/§6h.

## Recipes & gotchas (session-tested 2026-07-07)

Battle-tested operational knowledge from a real colour-import run. Read this before doing anything
non-trivial — it's what the command tables above don't tell you.

### Iterating on an EXISTING branch (a second round of edits)
The `plan`/`apply` flow is **one-shot main→branch**: `driftCheck` always validates against **main**,
and `apply` re-creates every op in the plan. So **re-running `tsw apply` against a branch that
already has your tokens double-creates them** — don't. To make further edits to a branch that already
diverges from main:
1. **Re-baseline local state to the branch:** `./bin/tsctl pull --branch <branch-uuid> --force`.
   Now `snapshot.json` = the branch, so uuid lookups resolve against branch state.
2. **Edit with `tsw set` / `tsw rm`** — these look up the uuid in `snapshot.json` and PATCH/DELETE
   **directly (no driftCheck)**, e.g. `./bin/tsw set semantic/foo "{accent.9}" --branch <branch-uuid> --allow-set semantic --yes`.
3. **Always pass the branch UUID (36-char) to `--branch`, never the name.** A name makes
   `apply`/`set`/`rm` try to CREATE a branch → duplicate-name **500**.

### The branch is shared & mutable — re-pull before editing
A token's value changed in the Tokens Studio web UI *between* an `apply` and the next `pull` this
session (`border.focus`: `#5e9ed6` → `{border.focus}`). The branch is not yours alone. Always
`pull --branch <id>` immediately before incremental edits, and treat `./bin/tsctl diff <branch>`
(server-side `review/changes`) as the source of truth for what's actually on the branch.

### Counting / filtering tokens by set (the `--count`/`--set` flags are broken)
`--count` prints full JSON; `--set <id>` returns `0`. But token objects carry both
`attributes.token_set_id` **and** `attributes.token_set_name`, so filter yourself:
```bash
./bin/tsctl tokens --branch <id> | jq '[.data[]|select(.attributes.token_set_name=="semantic")]|length'
```
For a set-scoped count offline, `tokens-project/snapshot.json`'s `.tokens[]` also carry `token_set_id`.
Net-change sanity check: `./bin/tsctl tokens | jq '.data|length'` on main vs branch (e.g.
846 = 877 − 90 + 59 confirmed the delete/create arithmetic without any set filter).

### "Removing" a token set
The API can't **create** sets (§6i, 500) and set **deletion** isn't wired. To empty a set, delete its
tokens (`tsw rm <set>/<name> --allow-set <set>` per token). An **empty set shell remains** and must be
deleted by hand in the web UI.

### Auth in this harness
`login.mts` prompts for the password interactively — the Bash tool **cannot type it**. Either
`STUDIO_PASSWORD` is set, or ask the user to run it themselves: `! npx tsx <abs-path>/login.mts`
(the `!` prefix runs it in the user's session so the prompt works). `login.mts` resolves
`.session.local` relative to its own file, so an absolute path works from any cwd.

### Colour import recipe (Figma semantic export → scheme references)
The proven loop (see `POC-alex-color-import.md` and `build-semantic-schema.mts` in this folder):
1. **Input:** a Figma export where each leaf carries
   `$extensions.com.figma.aliasData.targetVariableName` like `"Light/Gray/1"`, `"Orange/11"`,
   `"Neutral/4"`.
2. **Map colour-family + step → scheme role** (mode-free, step preserved):
   `gray & Neutral → neutral · moss-green → accent · red → danger · blue → info · green → success ·
   orange → warning` (north-sea has no scheme role). E.g. `Light/Gray/1 → {neutral.1}`,
   `Orange/8 → {warning.8}`. This keeps the semantic layer mode-independent (ADR-0006).
3. **Sanitize names:** spaces → hyphens (the API rejects spaces/braces/brackets → **422**).
4. **Write into `semantic` as references** (`{role.step}` strings in `$value`) — never raw hex,
   barring sanctioned exceptions.
5. **Colour layering** (reference chain): `input/palette` + `input/scale` → `foundation/gaussian` +
   `foundation/anchor` → `color/light|dark` (generated scales) → `scheme/light|dark` (role scales
   `accent/neutral/danger/info/success/warning.N` → `{light.<family>.N}`, plus special named tokens
   like `border-focus`, `bg-input`, `text-link`) → `semantic` (usage → `{role.N}`) → `concept`.
   `build-semantic-schema.mts` does the flatten + map + sanitize deterministically.

### Setting Figma scopes (`extensions`)
Scopes + `hiddenFromPublishing` flow through the normal sync now (implemented — `EXTENSIONS-PLAN.md`).
Two ways:
- **Declarative:** after `pull`, set `$extensions` on a token in `sets/*.json`, then `plan` → `apply`.
  Shape: `"$extensions": { "com.figma": { "scopes": ["TEXT_FILL"], "hiddenFromPublishing": true } }`.
- **One-shot:** `tsw set <set>/<name> <value> --branch <b> --scopes TEXT_FILL,SHAPE_FILL --hidden --allow-set <set> --yes`.

Notes: the API **replaces** the `com.figma` object (send the full shape you want — the CLI does);
tokens with no `$extensions` default to **ALL_SCOPES** in Figma; and `apply`'s change count
**under-reports extensions-only edits as 0** — verify with `resolved`/`diff`, not the summary. Colour
scope vocabulary: `ALL_SCOPES`, `TEXT_FILL`, `FRAME_FILL`, `SHAPE_FILL`, `STROKE_COLOR`,
`EFFECT_COLOR`; dimensions: `WIDTH_HEIGHT`, `GAP`, `CORNER_RADIUS`, `STROKE_FLOAT`, `FONT_SIZE`, …

## Which doc to read for what

- **This file (`CLAUDE.md`)** — the AI operational how-to: when to use which command, the recipes &
  gotchas above. Start here.
- **`API-NOTES.md`** — reverse-engineered API truth (host, auth, JSON:API, write shapes §6, resolved
  shape). **Trust it over the scraped `docs/` for anything auth/transport/shape** — the scraped docs
  are idealized/AI-generated and are wrong on the API host, the service-account exchange flow, and
  response shapes. Also remember `tsctl`/`tsw` authenticate with a **User JWT from a password login**
  (`login.mts`), **not** a service-account token — ignore any SAT-based auth the scraped docs push.
- **`QUIRKS.md`** — the consolidated index of counter-intuitive behaviours (API, CLI, companion→Figma,
  platform). Skim it before trusting anything to "just work."
- **`README.md`** — human-facing setup + full command/flow reference + troubleshooting + code paths.
- **`docs/`** — an offline scrape of the Tokens Studio product documentation, colocated in this
  folder (a child directory), split by version. Reference material for concepts — read it here
  rather than re-fetching from the web. ⚠️ **Conceptual, not authoritative for transport:** for
  anything auth/host/response-shape it is superseded by `API-NOTES.md` (see the caveat above).
  - **`docs/v2-current/`** (59 files) — the **current** Tokens Studio v2 docs; default to these.
    Flat files named `documentation-v2.tokens.studio-<area>-<page>.html.md`, covering: `getting-started`
    (what-is-studio, quick-start, glossary, project-types, your-first-project), `api` (overview,
    authentication, tokens, token-sets, variables, branches, releases, webhooks), `cli` (overview,
    authentication, configuration, pulling-tokens, exporting-tokens), `branching`, `theming`, `tokens`,
    `tokenscript`, `integrations` (github-actions, service-account-tokens, webhooks, ci-cd-triggers),
    `figma`, `migration`, `releases`, `settings`, `team`. **Start here for platform concepts, the
    Connect Studio CLI, branching/theming, and token model questions.**
  - **`docs/v1-legacy/`** (232 files) — the **previous** version's docs. Flat files named
    `documentation.tokens.studio-<area>-<page>.md`, covering: `connect-studio-to-code` (graphql /
    postman / **tokens-studio-cli**), `connect-studio-to-figma` (companion + classic Figma plugin),
    `getting-started`, `platform` (tokens/themes/releases/configuration), `plugins`, `settings`,
    `graph-engine` (the bulk — full node reference under `available-nodes-*`, editor, types), and
    `example-graphs`. Legacy, but often the **only** place a concept is explained in depth (e.g. the
    graph engine, the legacy CLI/GraphQL flow) — consult it when v2 doesn't cover something.
- **`WRITE-LAYER-PLAN.md`, `PROBE-PLAN.md`, `POC-alex-color-import.md`, `EXTENSIONS-PLAN.md`** —
  planning/history (why the write layer is shaped this way; endpoint-verification results; the
  colour-import POC; the scopes/`extensions` support plan). Background, not day-to-day.
