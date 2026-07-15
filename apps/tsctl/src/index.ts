#!/usr/bin/env node
/**
 * index.ts — `tsctl`, the READ-ONLY CLI. Parses args and routes to read commands
 * (whoami/sets/tokens/resolved/collections/variables/raw) and the read-only sync
 * commands (pull/status/plan/diff, in sync.ts). All API access here is GET-only via
 * client.ts. Live writes live in the separate `tsw` CLI (write-cli.ts). See README.
 */
import { loadConfig, requireProjectId, type Config } from "./config.ts";
import { apiGet } from "./client.ts";
import { pull, status, plan, diffBranch, snapshot, listSnapshots } from "./sync.ts";

interface Args {
  command: string;
  positional: string[];
  flags: Record<string, string | true>;
  multi: Record<string, string[]>;
}

const MULTI_FLAGS = new Set(["theme-option"]);

function parseArgs(argv: string[]): Args {
  const positional: string[] = [];
  const flags: Record<string, string | true> = {};
  const multi: Record<string, string[]> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      const value = next !== undefined && !next.startsWith("--") ? (i++, next) : true;
      if (MULTI_FLAGS.has(key) && typeof value === "string") {
        (multi[key] ??= []).push(value);
      } else {
        flags[key] = value;
      }
    } else {
      positional.push(arg);
    }
  }
  const [command = "help", ...rest] = positional;
  return { command, positional: rest, flags, multi };
}

function output(data: unknown, flags: Record<string, string | true>): void {
  if (flags.count && Array.isArray(data)) {
    console.log(String(data.length));
    return;
  }
  console.log(JSON.stringify(data, null, 2));
}

/** Some list endpoints return a bare array, others wrap in { data: [...] }. */
function asArray(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    for (const key of ["data", "items", "results", "tokens", "token_sets", "projects"]) {
      const v = (data as Record<string, unknown>)[key];
      if (Array.isArray(v)) return v;
    }
  }
  return [];
}

const HELP = `tsctl — read-only CLI over the Tokens Studio v2 API

Usage: tsctl <command> [options]

Commands:
  whoami                     Verify the token, print the current user
  projects                   List projects (find your TS_PROJECT_ID here)
  sets                       List token sets in the project
  tokens                     List tokens
     --set <name|id>            filter to one token set (client-side)
     --branch <change_set_id>   read from a branch instead of main
  resolved                   List tokens with resolved/computed values
     --branch <change_set_id>
     --theme-option <id>        repeatable — active theme option ids
  collections                List Figma variable collections
  variables                  List Figma variables
  raw <path>                 GET an arbitrary API path (GET only), e.g.
                             tsctl raw /projects/<id>/token_sets

Project sync (Phase 1 — READ-ONLY over the API; pull writes LOCAL files only):
  pull                       Fetch live → tokens-project/ (snapshot + editable
                             per-set files + id-map). --branch <id>, --force.
                             DOES NOT change the live project.
  status                     Diff local desired-state vs snapshot (offline).
                             DOES NOT write anything.
  plan                       Compute create/update/delete ops → plan.json.
                             DOES NOT touch live — always a dry run.
  diff <branch-id>           Print a branch's server-side review/changes.
                             DOES NOT write anything.
  snapshot [--label <name>]  Save a durable restore point of current live →
                             tokens-project/snapshots/. DOES NOT change live.
  snapshots                  List saved restore points. (offline)

Global options:
  --project <id>   override TS_PROJECT_ID
  --branch <id>    read from a branch (change_set_id) instead of main
  --force          (pull) discard local edits and re-pull
  --count          print only the number of items (for list commands)
  --json           (default) print pretty JSON

Auth: run \`npx tsx login.mts\` (User JWT). Config: TS_PROJECT_ID in .env.
Writes to the live project (apply/merge) are NOT here yet — see WRITE-LAYER-PLAN.md.`;

async function main(): Promise<void> {
  const { command, positional, flags, multi } = parseArgs(process.argv.slice(2));

  if (command === "help" || flags.help) {
    console.log(HELP);
    return;
  }

  const cfg: Config = loadConfig();
  const projectOverride = typeof flags.project === "string" ? flags.project : undefined;
  const branch = typeof flags.branch === "string" ? flags.branch : undefined;

  switch (command) {
    case "whoami": {
      output(await apiGet(cfg, "/auth/me"), flags);
      break;
    }
    case "projects": {
      output(await apiGet(cfg, "/projects"), flags);
      break;
    }
    case "sets": {
      const pid = requireProjectId(cfg, projectOverride);
      output(await apiGet(cfg, `/projects/${pid}/token_sets`), flags);
      break;
    }
    case "tokens": {
      const pid = requireProjectId(cfg, projectOverride);
      const data = await apiGet(cfg, `/projects/${pid}/tokens`, {
        query: { change_set_id: branch },
      });
      const setFilter = typeof flags.set === "string" ? flags.set : undefined;
      if (setFilter) {
        const filtered = asArray(data).filter((t) => {
          const o = t as Record<string, unknown>;
          return o.token_set_id === setFilter || o.token_set === setFilter;
        });
        output(filtered, flags);
      } else {
        output(data, flags);
      }
      break;
    }
    case "resolved": {
      const pid = requireProjectId(cfg, projectOverride);
      output(
        await apiGet(cfg, `/projects/${pid}/resolved_tokens`, {
          query: { change_set_id: branch, theme_options: multi["theme-option"] },
        }),
        flags
      );
      break;
    }
    case "collections": {
      const pid = requireProjectId(cfg, projectOverride);
      output(await apiGet(cfg, `/projects/${pid}/variable_collections`), flags);
      break;
    }
    case "variables": {
      const pid = requireProjectId(cfg, projectOverride);
      output(await apiGet(cfg, `/projects/${pid}/variables`), flags);
      break;
    }
    case "raw": {
      const path = positional[0];
      if (!path) throw new Error("raw requires a path, e.g. tsctl raw /projects");
      output(await apiGet(cfg, path), flags);
      break;
    }
    case "pull": {
      const pid = requireProjectId(cfg, projectOverride);
      await pull(cfg, pid, { branch, force: flags.force === true });
      break;
    }
    case "status": {
      status();
      break;
    }
    case "plan": {
      plan();
      break;
    }
    case "diff": {
      const pid = requireProjectId(cfg, projectOverride);
      const branchId = positional[0];
      if (!branchId) throw new Error("diff requires a branch id, e.g. tsctl diff <change_set_id>");
      await diffBranch(cfg, pid, branchId);
      break;
    }
    case "snapshot": {
      const pid = requireProjectId(cfg, projectOverride);
      await snapshot(cfg, pid, typeof flags.label === "string" ? flags.label : undefined);
      break;
    }
    case "snapshots": {
      listSnapshots();
      break;
    }
    default:
      console.error(`Unknown command: ${command}\n`);
      console.log(HELP);
      process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exitCode = 1;
});
