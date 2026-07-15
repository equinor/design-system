#!/usr/bin/env node
/**
 * write-cli.ts — `tsw`, the GUARDED write CLI (Phase 2). Separate from `bin/tsctl`
 * (read-only) on purpose. Every command writes ONLY to a scratch branch, dry-run by
 * default. Auth is the User JWT (run `npx tsx login.mts`). See WRITE-LAYER-PLAN.md.
 */
import { loadConfig, requireProjectId, type Config } from "./config.ts";
import { apply, restore, setToken, rmToken, branchList, branchNew, branchArchive, type ApplyOpts, type RestoreOpts } from "./apply.ts";

interface Args {
  command: string;
  sub?: string;
  positional: string[];
  flags: Record<string, string | true>;
  multi: Record<string, string[]>;
}

const MULTI = new Set(["allow-set"]);

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
      if (MULTI.has(key) && typeof value === "string") (multi[key] ??= []).push(value);
      else flags[key] = value;
    } else positional.push(arg);
  }
  const [command = "help", ...rest] = positional;
  return { command, positional: rest, flags, multi };
}

const HELP = `tsw — guarded write CLI for Tokens Studio (Phase 2)

Every command writes ONLY to a scratch branch and is DRY-RUN unless you pass --yes.
It refuses to touch main or the colour branch, and refuses sets you haven't allowed.

Usage: tsw <command> [options]

Commands:
  apply --branch <name|id> [--yes]        Execute tokens-project/plan.json on a scratch branch.
        [--allow-delete] [--allow-set S]     DOES: drift-check, snapshot, create/update(PATCH-by-uuid)/delete.
        [--force-destructive]                DOES NOT: write main, run without a plan, delete without
                                             --allow-delete, touch un-allowed sets, or merge.

  set <set>/<name> <value> --branch <b>   Create/update one token (PATCH-by-uuid if it exists).
      [--type T] [--allow-set S] [--yes]     --scopes A,B and --hidden|--no-hidden set Figma
      [--scopes A,B] [--hidden|--no-hidden]  variable scopes / hiddenFromPublishing (full replace).

  rm <set>/<name> --branch <b> [--yes]    Delete one token on a scratch branch. [--allow-set S]

  restore <snapshot|latest> --branch <b>  Roll live back to a saved snapshot, on a scratch branch.
      [--yes] [--allow-delete]             DOES: revert changed tokens (PATCH-by-uuid), recreate
      [--allow-set S | --allow-all-sets]   tokens deleted since (NEW uuid), delete tokens added since.
      [--force-destructive]                DOES NOT: write main; run without --yes; delete without
                                           --allow-delete. Snapshots current live first (reversible).

  branch list                             List branches.
  branch new <name>                       Create a scratch branch.
  branch archive <id>                     Archive a branch (refuses main / protected).

Global: --project <id>. Auth: run \`npx tsx login.mts\` first (log in with your password).
Safety model + what each command does/doesn't: WRITE-LAYER-PLAN.md §3–§4.`;

async function main(): Promise<void> {
  const { command, positional, flags, multi } = parseArgs(process.argv.slice(2));
  if (command === "help" || flags.help) {
    console.log(HELP);
    return;
  }

  const cfg: Config = loadConfig();
  const pid = requireProjectId(cfg, typeof flags.project === "string" ? flags.project : undefined);
  const branch = typeof flags.branch === "string" ? flags.branch : undefined;
  const allowSets = multi["allow-set"] ?? [];
  const yes = flags.yes === true;

  switch (command) {
    case "apply": {
      if (!branch) throw new Error("apply requires --branch <name|id>.");
      const opts: ApplyOpts = {
        branch,
        yes,
        allowDelete: flags["allow-delete"] === true,
        allowSets,
        forceDestructive: flags["force-destructive"] === true,
      };
      await apply(cfg, pid, opts);
      break;
    }
    case "set": {
      const [ref, value] = positional;
      if (!ref || value === undefined) throw new Error("set requires <set>/<name> <value>.");
      if (!branch) throw new Error("set requires --branch <name|id>.");
      const scopes = typeof flags.scopes === "string" ? flags.scopes.split(",").map((s) => s.trim()).filter(Boolean) : undefined;
      const hidden = flags.hidden === true ? true : flags["no-hidden"] === true ? false : undefined;
      await setToken(cfg, pid, ref, value, { branch, type: typeof flags.type === "string" ? flags.type : undefined, yes, allowSets, scopes, hidden });
      break;
    }
    case "rm": {
      const [ref] = positional;
      if (!ref) throw new Error("rm requires <set>/<name>.");
      if (!branch) throw new Error("rm requires --branch <name|id>.");
      await rmToken(cfg, pid, ref, { branch, yes, allowSets });
      break;
    }
    case "restore": {
      const [ref] = positional;
      if (!ref) throw new Error("restore requires a snapshot ref (name, path, or 'latest').");
      if (!branch) throw new Error("restore requires --branch <name|id>.");
      const opts: RestoreOpts = {
        branch,
        yes,
        allowDelete: flags["allow-delete"] === true,
        allowSets,
        allowAllSets: flags["allow-all-sets"] === true,
        forceDestructive: flags["force-destructive"] === true,
      };
      await restore(cfg, pid, ref, opts);
      break;
    }
    case "branch": {
      const sub = positional[0];
      if (sub === "list") await branchList(cfg, pid);
      else if (sub === "new") {
        const name = positional[1];
        if (!name) throw new Error("branch new requires a name.");
        await branchNew(cfg, pid, name);
      } else if (sub === "archive") {
        const id = positional[1];
        if (!id) throw new Error("branch archive requires an id.");
        await branchArchive(cfg, pid, id);
      } else throw new Error("branch <list|new|archive>.");
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
