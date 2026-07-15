# tsctl — Tokens Studio v2 CLI

A small command-line tool for inspecting (and, carefully, editing) the EDS token project in
[Tokens Studio](https://tokens.studio) straight from your terminal — without clicking through the
web app. It talks to the [Tokens Studio v2 REST API](https://api-production.tokens.studio/api/v1)
and was built for the EDS token-redefinition work.

It is **not** a replacement for the official Connect Studio CLI (`studio tokens pull`), which owns
the build-pipeline export ([#5108](https://github.com/equinor/design-system/issues/5108)). `tsctl`
fills the interactive "let me see / tweak the live project" gap: check what's on a branch, count
tokens per set, read resolved values under a given mode, propose an edit as a reviewable diff.

> **New here? Read this in order:** [What you get](#what-you-get) → [Requirements](#requirements) →
> [Setup (first-time onboarding)](#setup-first-time-onboarding) → [How to use](#how-to-use). Then
> keep the [command reference](#command-reference-tsctl-read-only) handy.

---

## What you get

Two separate command-line tools, on purpose:

| Tool | What it is | Can it change the live project? |
|------|-----------|--------------------------------|
| **`tsctl`** (`bin/tsctl`) | The **read-only** CLI. Every command only ever issues an HTTP `GET`. | **No** — there is no code path in it that can write. Safe to point at the shared live project. |
| **`tsw`** (`bin/tsw`) | The **guarded write** CLI. Creates/updates/deletes tokens and branches. | **Yes, but only on a scratch branch, and only after you confirm.** It structurally refuses to write `main`. |

They are kept apart so the read-only guarantee is real: `tsctl` literally has no POST/PATCH/DELETE
in it. Anything that mutates the project lives in `tsw` (or the low-level `probe.mts`).

Both authenticate the same way: **you log in once with your password**, which caches a session
token for the day. There is no API key or service-account token to manage — see
[Authentication](#authentication).

---

## Requirements

- **Node.js 20+** (uses the built-in `fetch`). Check with `node -v`.
- **Network access** to `api-production.tokens.studio`. On a locked-down / sandboxed shell, DNS may
  be blocked (you'll see `ENOTFOUND` / `fetch failed`) — run in a normal terminal.
- A **Tokens Studio account** that is a member of the EDS project, with a **password set** on it
  (see the security note below — you may need to set one).

No build step: `bin/tsctl` and `bin/tsw` run the TypeScript directly via
[`tsx`](https://github.com/privatenumber/tsx), which `npm install` provides.

---

## Setup (first-time onboarding)

```bash
# 1. Install dependencies (installs tsx + typescript locally)
cd tsctl
npm install

# 2. Create your .env from the template, then set TS_PROJECT_ID
cp .env.example .env
#    - Open .env and set TS_PROJECT_ID to the EDS project id.
#    - Don't know it? Log in (step 3) and run `./bin/tsctl projects` to list projects and ids.
#    - Optionally set TS_USER_EMAIL to your Tokens Studio email (defaults to the account owner's).

# 3. Log in (caches a session token for ~23h)
npx tsx login.mts
#    Prompts for your password (hidden — nothing is echoed or stored to disk).

# 4. Verify it works
./bin/tsctl whoami        # should print your user
./bin/tsctl sets          # should list the EDS token sets
```

That's it. From here, `./bin/tsctl <command>` reads the project and `./bin/tsw <command>` proposes
edits. Re-run `npx tsx login.mts` whenever your session expires (about once a day).

> **Tip — call it without `./bin/`:** run `npm link` in this folder (or add `tsctl/bin` to your
> `PATH`) and you can type `tsctl sets` / `tsw branch list` from anywhere.

### `.env.example`

`.env` only needs a project id. Everything else has a sensible default, and real shell/CI
environment variables always override the file.

```bash
# ── tsctl configuration ───────────────────────────────────────────────
# The Tokens Studio project to work against. Find it with: ./bin/tsctl projects
TS_PROJECT_ID=

# Optional — the email you sign in to Tokens Studio with.
# Defaults to the project owner's account if unset.
# TS_USER_EMAIL=you@equinor.com

# Optional — override the API host (you almost never need this).
# TS_BASE_URL=https://api-production.tokens.studio/api/v1

# ── Password (OPTIONAL — read the security note in the README first) ──
# Leave this UNSET and let `login.mts` prompt you (the password is never written to disk).
# Only set it if you must run login non-interactively (e.g. CI), and ONLY with a
# throwaway password you do not use anywhere else.
# STUDIO_PASSWORD=
```

`.env` and the cached session (`.session.local`) are **gitignored** and never committed.

---

## Authentication

Everything authenticates with a **User JWT** (a session token), obtained by logging in with your
Tokens Studio **password**:

```bash
npx tsx login.mts        # or: npm run login
```

`login.mts` calls `POST /auth/login`, reads the session token from the response, and caches it in
`.session.local` (gitignored, file mode `0600`, valid ~23h). Both `bin/tsctl` and `bin/tsw` read
that cached token — there is **no other credential path**. When it expires, commands fail with a
clear *"Run `npx tsx login.mts` again"*; just log in again.

Why a password/User JWT and not an API (service-account) token? A service-account token's scope
tops out at read/write **tokens** and cannot create **branches** — and every write here goes onto a
branch. A User JWT acts as the full user, so branch-first writes work. (The full investigation is in
`API-NOTES.md` §6a; you don't need it to use the tool.)

### 🔐 Security note — use a throwaway password

`login.mts` prompts for your password **hidden**, and does **not** store it — only the short-lived
session token is cached. **Prefer the prompt.**

If you instead set `STUDIO_PASSWORD` in `.env` (to skip the prompt, e.g. for automation), your
Tokens Studio password is sitting in **plaintext on disk**. Before you do that:

- **Reset your Tokens Studio password to a unique, throwaway one** that you do **not** use for
  anything else (not your Equinor login, not your email, nowhere). If you normally sign in with
  Google/SSO, set a dedicated password on the account for this.
- Treat that password as disposable — rotate it freely, and never reuse it.
- `.env` is gitignored, but plaintext-on-disk is still plaintext-on-disk. When in doubt, don't set
  `STUDIO_PASSWORD` at all and just answer the prompt.

The tool never logs or prints your password or the session token.

---

## Command reference — `tsctl` (read-only)

Run as `./bin/tsctl <command> [options]`. Output is pretty-printed JSON. ✅ = verified against the
live API.

> ⚠️ **`--count` and `--set` are unreliable** in this build (`--count` prints the full JSON;
> `--set` matches nothing). Count and filter with [`jq`](https://jqlang.github.io/jq/) instead —
> every token object carries `attributes.token_set_id` **and** `attributes.token_set_name`. Examples
> are in [How to use](#how-to-use) and in `CLAUDE.md` → *Recipes & gotchas*.

### Inspecting the project

| Command | Endpoint | What it does |
|---|---|---|
| `whoami` | `GET /auth/me` | ✅ Prints the acting user (email, id). Confirms your session is valid. |
| `projects` | `GET /projects` | Lists the projects you can see — use it to find `TS_PROJECT_ID`. |
| `sets` | `GET /projects/:id/token_sets` | ✅ Lists token sets (`primitives/default`, `font/default`, `density/*`, `semantic/default`) with `set_type`, `order_index`, and the branch (`change_set`) they belong to. |
| `tokens` | `GET /projects/:id/tokens` | ✅ Lists tokens (name, value, type, `token_set_id`, `token_set_name`, Figma `extensions`). Flag: `--branch <change_set_id>` reads a branch instead of `main`. |
| `resolved` | `GET /projects/:id/resolved_tokens` | ✅ **Computed** values with aliases followed — what a consumer actually gets. Flags: `--branch <change_set_id>`; `--theme-option <id>` (repeatable) to resolve under a specific mode combination. ⚠️ Response shape differs — see the note below. |
| `collections` | `GET /projects/:id/variable_collections` | Lists Figma variable collections (the mode-bearing collections). |
| `variables` | `GET /projects/:id/variables` | Lists individual Figma variables and their `values_by_mode`. |
| `raw <path>` | `GET <path>` | ✅ GETs any API path (GET-locked). The escape hatch for endpoints not yet wrapped — e.g. `raw /projects/<id>/branches`. |

**`resolved` response shape:** unlike everything else (which is JSON:API with `data: [...]`),
`resolved`'s `.data` is an **object keyed by token name** → the computed value as a string
(`"oklch(0.97 0 0)"`). Read one with `jq -r '.data["background.container.canvas.default"]'`; spot
broken references by scanning values for `null`/`?`.

**Endpoints reachable today only via `raw`** (confirmed working, not yet wrapped):

- `raw /projects/:id/branches` — list branches (`main` is itself a branch / `change_set`).
- `raw /projects/:id/theme_groups` and `.../theme_options` — theme groups and their
  `selected_token_sets` map.
- `raw /projects/:id/branches/:id/review/changes` — the plan-diff for a branch.

### Local sync (git-style, still read-only over the API)

These pull the live project down into editable local files so you can prepare an edit as a
reviewable diff. **None of them change the live project** — `pull` and `diff` only `GET`; `status`
and `plan` are fully offline. Local files land in `tokens-project/`.

| Command | What it does | What it does NOT do |
|---|---|---|
| `pull [--branch <id>] [--force]` | Fetch live → `tokens-project/`: `snapshot.json` (the diff baseline), editable `sets/<path>.json` (keyed by token name), `id-map.json` (name→uuid). | Change the live project. Overwrite local edits without `--force`. |
| `status` | Diff your local edits vs `snapshot.json`; print `+create ~update -delete` per set. Offline. | Write anything; contact the API. |
| `plan` | Compute the ordered op list (creates → updates → deletes), resolve UUIDs, flag destructive deletes, write `plan.json`. | Touch live — always a dry run. |
| `diff <branch-id>` | Print a branch's server-side `review/changes` (per-entity change counts). | Write anything. |
| `snapshot [--label <name>]` | Save a durable, timestamped restore point of current live → `tokens-project/snapshots/`. These are what `tsw restore` reads. | Change the live project. |
| `snapshots` | List saved restore points (newest first). Offline. | Write anything. |

### Global options

`--project <id>` (override `TS_PROJECT_ID`) · `--branch <id>` (read a branch instead of `main`) ·
`--force` (on `pull`, discard local edits and re-pull) · `--json` (default) · `--help`.
(`--count` exists but is unreliable — use `jq`.)

---

## Command reference — `tsw` (guarded writes)

The write CLI, deliberately separate from `tsctl`. Every command:

- writes **only to a scratch branch** (never `main`, never the protected colour branch);
- is a **dry run unless you pass `--yes`**;
- refuses to touch a token set unless you explicitly allow it (`--allow-set <set>`);
- refuses deletes unless you pass `--allow-delete`, and refuses large deletes without
  `--force-destructive`.

Auth is your User JWT (log in first). Run as `./bin/tsw <command> [options]`.

| Command | What it does | What it refuses to do |
|---|---|---|
| `apply --branch <name\|id> [--yes] [--allow-delete] [--allow-set <s>]… [--force-destructive]` | Execute `tokens-project/plan.json`: drift-check (re-pull, verify each op's precondition), snapshot live, create/reuse the scratch branch, run creates + `batch_update` + deletes (**PATCH-by-UUID, never recreate**), verify via `review/changes`. | Write `main`/protected branches; run without a `plan.json`; touch sets not allowed; delete without `--allow-delete`; delete >5 without `--force-destructive`; merge. |
| `set <set>/<name> <value> --branch <b> [--type T] [--allow-set <s>] [--yes] [--scopes A,B] [--hidden\|--no-hidden]` | Create or update **one** token on a scratch branch (PATCH-by-UUID if it exists). `--scopes`/`--hidden` set the Figma variable scopes / `hiddenFromPublishing` (full replace). | Target `main`; write an un-allowed set; run without `--yes`. |
| `rm <set>/<name> --branch <b> [--allow-set <s>] [--yes]` | Delete one token on a scratch branch. | Target `main`; delete from an un-allowed set. |
| `restore <snapshot\|latest> --branch <b> [--yes] [--allow-delete] [--allow-set <s>\|--allow-all-sets] [--force-destructive]` | Roll live back to a saved snapshot on a scratch branch: revert changed tokens (PATCH-by-UUID), recreate tokens deleted since (⚠️ **new UUID** — Figma link can't be resurrected), delete tokens added since. Snapshots current live first, so it's reversible. | Write `main`; run without `--yes`; delete without `--allow-delete`. |
| `branch list` | List branches (id, status, name). | — |
| `branch new <name>` | Create a scratch branch. | — |
| `branch archive <id>` | Archive (discard) a scratch branch. | Archive `main` / a protected branch. |

**Opt-in writability:** nothing is writable until you name the set — either per run via
`--allow-set`, or persistently in `tokens-project/.tsctl-state.json` → `writableSets`.
`protectedBranches` there extends the always-refused list (`main` + the colour branch are
hard-coded).

**Merging is human-only.** `tsw` has no merge command. You review a branch and merge it into `main`
by hand in the Tokens Studio web UI — a deliberate checkpoint.

---

## How to use

> **The token names, set names, and branch names in the examples below are illustrative.** Token/set
> names change as the project evolves. Discover the real ones live before using them: `./bin/tsctl
> sets` for set names, `./bin/tsctl tokens | jq -r '.data[].attributes.name'` for token names. Don't
> copy an id or name out of `API-NOTES.md` or older notes into a command — those are point-in-time.

### 1. Just look at things (read-only)

```bash
# Who am I, and does my session work?
./bin/tsctl whoami

# What token sets exist, and how many tokens total?
./bin/tsctl sets
./bin/tsctl tokens | jq '.data | length'

# How many tokens are in the `semantic` set?
./bin/tsctl tokens | jq '[.data[] | select(.attributes.token_set_name=="semantic")] | length'

# What does a semantic token actually resolve to?
./bin/tsctl resolved | jq -r '.data["background.container.canvas.default"]'

# List branches (via raw — not yet a wrapped command).
# raw takes a literal path, so substitute your own project id (from .env / `tsctl projects`):
./bin/tsctl raw /projects/<project-id>/branches | jq '.data[].attributes | {id, name, status}'
```

### 2. Propose an edit and land it on a review branch

The safe loop is: **pull → edit files → status → plan → dry-run apply → apply → review in the web
UI → merge by hand.**

```bash
# 0. one-time per day: log in
npx tsx login.mts

# 1. pull live → local editable files
./bin/tsctl pull
#    Pulled 288 tokens across 6 sets from main → tokens-project/

# 2. edit the desired-state file by hand
#    e.g. change a $value in tokens-project/sets/semantic/default.json

# 3. see what changed (offline)
./bin/tsctl status
#    semantic/default:  +0 create   ~1 update   -0 delete

# 4. build + review the plan (dry run, no writes)
./bin/tsctl plan
#    ~ update  semantic/default/spacing.inline  [<uuid>]
#               $value: "{density.spacing.100}" → "{density.spacing.200}"

# 5. dry-run the apply — confirms the guards and target branch, still no writes
./bin/tsw apply --branch tweak-inline-spacing --allow-set semantic/default
#    DRY RUN — re-run with --yes to execute…

# 6. execute on a NEW scratch branch
./bin/tsw apply --branch tweak-inline-spacing --allow-set semantic/default --yes
#    ✓ Applied on branch <id>. review/changes reports 1 token change(s).

# 7. inspect the branch, then review + merge in the Tokens Studio web UI (merge is human-only)
./bin/tsctl diff <branch-id>

# to throw the branch away instead of merging:
./bin/tsw branch archive <branch-id>
```

**One-token shortcut** (skips the plan file):

```bash
./bin/tsw set semantic/default/spacing.inline "{density.spacing.200}" \
  --branch tweak --allow-set semantic/default --yes
```

### 3. Editing the same branch a second time

`apply` is one-shot `main → branch` (its drift-check reads `main` and it re-creates every op), so
**don't re-`apply` onto a branch that already has your tokens** — you'll double-create. Instead:

```bash
# re-baseline local state to the branch (note: pass the branch UUID, not its name)
./bin/tsctl pull --branch <branch-uuid> --force

# then edit with set/rm against the branch UUID — these PATCH/DELETE directly, no drift-check
./bin/tsw set semantic/foo "{accent.9}" --branch <branch-uuid> --allow-set semantic --yes
```

Full recipe (branch iteration, `jq` filtering, the colour-import loop) is in `CLAUDE.md` →
*Recipes & gotchas*.

### 4. Roll back a mistake

```bash
# save a restore point before risky work
./bin/tsctl snapshot --label before-color-import
./bin/tsctl snapshots            # list them

# later, roll live back to it on a scratch branch (reversible — snapshots current live first)
./bin/tsw restore latest --branch undo-color --allow-all-sets --allow-delete --yes
```

---

## Low-level tooling (`probe.mts`, `login.mts`)

For ad-hoc endpoint work that `tsw` doesn't wrap, `probe.mts` issues any method to any path using
your session token:

```bash
npx tsx probe.mts <METHOD> <path> [json-body]      # {PID} expands to TS_PROJECT_ID
```

⚠️ It writes to **whatever path you give it** — there are no guards. **Rule: every token/branch
mutation must carry `?change_set_id=<scratch-branch>`; never write `main`.** Prefer `tsw` for
anything routine. Verified request/response shapes are in `API-NOTES.md` §6g/§6h.

---

## Troubleshooting

| Symptom | Cause → fix |
|---|---|
| `No valid user session. Run npx tsx login.mts` | No/expired session → `npx tsx login.mts`. |
| `HTTP 401 — user session rejected` | Session expired mid-use → log in again. |
| `stdin is not a TTY … set STUDIO_PASSWORD` | You're not in an interactive terminal (e.g. a script) → run `login.mts` yourself in a real terminal, or set `STUDIO_PASSWORD` (read the [security note](#-security-note--use-a-throwaway-password) first). |
| `No project id. Pass --project …` | `TS_PROJECT_ID` not set → add it to `.env` (find it with `./bin/tsctl projects`). |
| `You have N uncommitted local change(s)… Re-run with --force` | `pull` won't overwrite local edits → apply/discard them, or `pull --force`. |
| `These sets are not writable` | Set not opted in → add `--allow-set <set>` or list it in `.tsctl-state.json` `writableSets`. |
| `Plan has N delete(s). Re-run with --allow-delete` | Deletes need explicit opt-in → add `--allow-delete`. |
| `DRIFT DETECTED — live changed since the plan` | Someone edited live → `./bin/tsctl pull` then `plan`, and re-apply. |
| `Refusing to write to protected branch` / `…without a change_set_id` | Working as intended — target a scratch branch. |
| `Network error … (ENOTFOUND)` / `fetch failed` | DNS/network blocked (often a sandboxed shell) → run in a normal terminal with internet access. |

---

## What tsctl does NOT do

- **No writes from `bin/tsctl`.** The read CLI is GET-only, including `raw`. Live mutations go
  through `bin/tsw` or `probe.mts`, never `tsctl`.
- **No merge / publish.** `tsw` refuses any `/merge` endpoint; merging a branch to `main` is
  **human-only**, by hand in the Tokens Studio web UI. (The merge endpoint is verified to exist, so
  a guarded `tsw merge` could be added later — it's held back on purpose.) `restore` **is** built.
- **No writing `main`.** Structurally refused: the write-client blocks protected branches and blocks
  any token mutation that lacks a scratch-branch `change_set_id`.
- **No token-SET creation.** `POST …/token_sets` returns 500 for every payload tried; new sets must
  be created in the web UI, then `pull`ed (`API-NOTES.md` §6i).
- **No API-key / service-account auth.** User JWT (password login) only.
- **No config beyond `.env`.** No named export configs or multi-project switching besides
  `--project`.

---

## Architecture & code paths

Two entry points share the config + auth modules but use **different HTTP clients** — that's what
keeps `tsctl` structurally read-only while `tsw` can write.

**Auth (shared):** `login.mts` → `src/user-auth.ts` `login()` → `POST /auth/login` → JWT from
`meta.token` → cached in `.session.local`. Every request reads it via `requireUserJwt()`.

**Read path** (`tsctl whoami|sets|tokens|resolved|…`):
```
bin/tsctl → src/index.ts (parse/route) → src/client.ts apiGet()  [GET only]
          → requireUserJwt() → fetch → JSON:API unwrap → print
```
`src/client.ts` has no POST/PATCH/DELETE code path — the read-only guarantee is structural.

**Sync path** (`tsctl pull|status|plan|diff`), `src/sync.ts`: `pull` GETs live and writes
`tokens-project/`; `status`/`plan` are offline diffs; `diff` GETs a branch's `review/changes`.

**Write path** (`tsw apply`), the guarded sequence in `src/apply.ts`: load plan → static guards →
dry-run gate → protected-branch check → drift-check → snapshot → resolve/create branch → execute
(POST creates + `batch_update` + DELETEs) → verify. `src/write-client.ts` `mutate()` is the **only**
function that issues POST/PATCH/DELETE, and it hard-refuses protected branches and branch-less
mutations before sending.

### File layout

| File | Role |
|------|------|
| `src/config.ts`    | Loads `.env`; resolves base URL + project id |
| `src/user-auth.ts` | Password login → User JWT, session cache (`.session.local`), `requireUserJwt()` |
| `src/client.ts`    | GET-only fetch wrapper (User-JWT auth, query params, error surfacing) |
| `src/index.ts`     | Arg parsing + read-only command router (`tsctl`) |
| `src/sync.ts`      | Sync — `pull`/`status`/`plan`/`diff` (read-only over the API) |
| `src/write-cli.ts` | Write router (`tsw`) — apply/set/rm/restore/branch |
| `src/apply.ts`     | Write engine — drift-check, guards, execute, verify |
| `src/write-client.ts` | The only POST/PATCH/DELETE client; enforces the protected-branch guard |
| `src/guards.ts`    | Protected branches, writable-set allowlist, destructive threshold |
| `bin/tsctl` / `bin/tsw` | Launchers — run the TS source via `tsx`, no build step |
| `login.mts`        | Log in with your password → cache a User JWT |
| `probe.mts`        | Issue any method to any path via the User JWT (low-level, unguarded) |
| `tokens-project/`  | Local declarative state — snapshot, editable set files, id-map, plan, `.tsctl-state.json` |

### Which doc to read for what

- **`README.md`** (this file) — human-facing setup, commands, how-to, troubleshooting. **Start here.**
- **`CLAUDE.md`** — the operational how-to for AI assistants: when to use which command, plus
  battle-tested *Recipes & gotchas* (branch iteration, `jq` filtering, the colour-import loop).
- **`API-NOTES.md`** — the reverse-engineered API truth (host, auth, JSON:API shapes, write shapes).
  Trust it over the scraped `docs/` for anything auth/transport-related.
- **`QUIRKS.md`** — a consolidated index of counter-intuitive behaviours (API / CLI / Figma /
  platform). Skim before trusting anything to "just work."
- **`docs/`** — an offline scrape of the Tokens Studio product docs, colocated in this folder:
  `docs/v2-current/` (current v2 platform — default here) and `docs/v1-legacy/` (previous version,
  incl. the graph-engine reference). Conceptual reference; **not** authoritative on auth/transport
  (that's `API-NOTES.md`).
- **`WRITE-LAYER-PLAN.md`, `PROBE-PLAN.md`, `SCOPING-PLAN.md`, `EXTENSIONS-PLAN.md`,
  `POC-alex-color-import.md`** — planning & history: why the write layer is shaped this way, how
  endpoints were verified, the colour-import POC. Deep background, not day-to-day.
</content>
