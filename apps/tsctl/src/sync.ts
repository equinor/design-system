/**
 * sync.ts — Phase 1 of the write layer (see WRITE-LAYER-PLAN.md).
 *
 * DECLARATIVE, git-style token sync. Phase 1 is READ-ONLY over the API: it pulls
 * live into local files and diffs them. It NEVER mutates the live project — that's
 * Phase 2 (`apply`), which gets its own guarded, branch-scoped entry point.
 *
 *   pull    live → local files (snapshot + editable per-set files + id-map)
 *   status  local desired-state vs snapshot   (offline; like `git status`)
 *   plan    desired vs snapshot → ordered op list, no writes  (writes plan.json)
 *   diff    print a branch's server-side review/changes        (read-only GET)
 *
 * Local layout under tokens-project/:
 *   snapshot.json        exact pull (ids + values) — the diff/drift baseline
 *   sets/<path>.json     editable desired-state, keyed by token name (no ids)
 *   id-map.json          "<set>/<token>" → uuid  (so Phase 2 PATCHes by uuid)
 *   plan.json            last computed plan
 *   .tsctl-state.json    pull metadata
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Config } from "./config.ts";
import { apiGet } from "./client.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DATA_DIR = join(ROOT, "tokens-project");
const SETS_DIR = join(DATA_DIR, "sets");
const SNAPSHOT = join(DATA_DIR, "snapshot.json");
const SNAP_DIR = join(DATA_DIR, "snapshots");
const ID_MAP = join(DATA_DIR, "id-map.json");
const PLAN_FILE = join(DATA_DIR, "plan.json");
const STATE = join(DATA_DIR, ".tsctl-state.json");

/** Some list endpoints return a bare array, others wrap in { data: [...] }. */
function asArray(data: unknown): any[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const v = (data as Record<string, unknown>).data;
    if (Array.isArray(v)) return v;
  }
  return [];
}

const attrs = (item: any): any => item?.attributes ?? {};

interface TokenRec {
  id: string;
  name: string;
  type: string | null;
  value: unknown;
  description: string | null;
  token_set_id: string;
  token_set_name: string;
  extensions?: unknown;
}
interface SetRec {
  id: string;
  name: string;
  set_type: string | null;
  order_index: number | null;
}
interface Snapshot {
  pulledAt: string;
  projectId: string;
  branch: string;
  sets: SetRec[];
  tokens: TokenRec[];
  themeOptions: any[];
}

/** A single desired token, keyed by name inside a set file. */
interface DesiredToken {
  $type: string | null;
  $value: unknown;
  $description: string | null;
  /** Raw Figma metadata, e.g. { "com.figma": { scopes: [...], hiddenFromPublishing: bool } }. */
  $extensions?: unknown;
}

// ── helpers ────────────────────────────────────────────────────────────────

function setFilePath(setName: string): string {
  return join(SETS_DIR, ...setName.split("/")) + ".json";
}

/** Recursively collect *.json files under a dir. */
function walkJson(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkJson(p));
    else if (entry.isFile() && entry.name.endsWith(".json")) out.push(p);
  }
  return out;
}

/** Remove empty directories under `root` (bottom-up); never removes `root` itself. */
function pruneEmptyDirs(root: string): void {
  if (!existsSync(root)) return;
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const sub = join(root, entry.name);
    pruneEmptyDirs(sub);
    if (readdirSync(sub).length === 0) rmSync(sub, { recursive: true });
  }
}

function readSnapshot(): Snapshot {
  if (!existsSync(SNAPSHOT)) {
    throw new Error("No snapshot.json — run `tsctl pull` first.");
  }
  return JSON.parse(readFileSync(SNAPSHOT, "utf8")) as Snapshot;
}

/** Read all editable set files → Map<setName, Map<tokenName, DesiredToken>>. */
function readDesired(): Map<string, Map<string, DesiredToken>> {
  const out = new Map<string, Map<string, DesiredToken>>();
  for (const file of walkJson(SETS_DIR)) {
    const obj = JSON.parse(readFileSync(file, "utf8")) as {
      $set: string;
      tokens: Record<string, DesiredToken>;
    };
    const inner = new Map<string, DesiredToken>();
    for (const [name, t] of Object.entries(obj.tokens ?? {})) inner.set(name, t);
    out.set(obj.$set, inner);
  }
  return out;
}

/** Baseline tokens from the snapshot → Map<setName, Map<tokenName, TokenRec>>. */
function snapshotBySet(snap: Snapshot): Map<string, Map<string, TokenRec>> {
  const out = new Map<string, Map<string, TokenRec>>();
  for (const t of snap.tokens) {
    if (!out.has(t.token_set_name)) out.set(t.token_set_name, new Map());
    out.get(t.token_set_name)!.set(t.name, t);
  }
  return out;
}

const valuesDiffer = (a: unknown, b: unknown): boolean =>
  JSON.stringify(a) !== JSON.stringify(b);

/**
 * Normalize a token's `extensions`: treat null / undefined / `{}` / `{"com.figma":{}}`
 * as "no extensions" (→ undefined). Prevents spurious update ops for tokens that never
 * had meaningful Figma metadata (the vast majority).
 */
export function normExt(ext: unknown): unknown {
  if (ext == null || typeof ext !== "object") return ext ?? undefined;
  const o = ext as Record<string, unknown>;
  const keys = Object.keys(o);
  if (keys.length === 0) return undefined;
  const fig = o["com.figma"];
  const figEmpty = fig != null && typeof fig === "object" && Object.keys(fig as object).length === 0;
  if (keys.length === 1 && figEmpty) return undefined;
  return ext;
}

const extDiffer = (a: unknown, b: unknown): boolean =>
  JSON.stringify(normExt(a)) !== JSON.stringify(normExt(b));

export interface Op {
  kind: "create" | "update" | "delete";
  set: string;
  name: string;
  uuid?: string; // present for update/delete
  before?: Partial<DesiredToken>;
  after?: DesiredToken;
}

export interface DiffResult {
  ops: Op[];
  needsNewSet: string[]; // desired sets not present live (API can't create sets — §6i)
}

/** Compute create/update/delete ops from desired vs snapshot. Pure, no I/O. */
function computeDiff(
  desired: Map<string, Map<string, DesiredToken>>,
  snap: Snapshot
): DiffResult {
  const liveSetNames = new Set(snap.sets.map((s) => s.name));
  const base = snapshotBySet(snap);
  const idMap: Record<string, string> = existsSync(ID_MAP)
    ? JSON.parse(readFileSync(ID_MAP, "utf8"))
    : {};
  const ops: Op[] = [];
  const needsNewSet: string[] = [];

  for (const [setName, tokens] of desired) {
    if (!liveSetNames.has(setName)) needsNewSet.push(setName);
    const baseTokens = base.get(setName) ?? new Map<string, TokenRec>();
    for (const [name, d] of tokens) {
      const live = baseTokens.get(name);
      if (!live) {
        ops.push({ kind: "create", set: setName, name, after: d });
      } else if (
        valuesDiffer(live.value, d.$value) ||
        valuesDiffer(live.type, d.$type) ||
        valuesDiffer(live.description ?? null, d.$description ?? null) ||
        extDiffer(live.extensions, d.$extensions)
      ) {
        ops.push({
          kind: "update",
          set: setName,
          name,
          uuid: live.id,
          before: { $type: live.type, $value: live.value, $description: live.description ?? null, $extensions: normExt(live.extensions) },
          after: d,
        });
      }
    }
    // deletes: in snapshot for this set but not in desired
    for (const [name, live] of baseTokens) {
      if (!tokens.has(name)) {
        ops.push({
          kind: "delete",
          set: setName,
          name,
          uuid: idMap[`${setName}/${name}`] ?? live.id,
          before: { $type: live.type, $value: live.value, $description: live.description ?? null, $extensions: normExt(live.extensions) },
        });
      }
    }
  }
  return { ops, needsNewSet };
}

// ── commands ─────────────────────────────────────────────────────────────────

/** Fetch the live project state (sets + tokens + theme options) into a Snapshot. GET-only. */
export async function fetchLive(cfg: Config, pid: string, branch?: string): Promise<Snapshot> {
  const q = { change_set_id: branch };
  const setsRaw = asArray(await apiGet(cfg, `/projects/${pid}/token_sets`, { query: q }));
  const tokensRaw = asArray(await apiGet(cfg, `/projects/${pid}/tokens`, { query: q }));
  const themesRaw = asArray(await apiGet(cfg, `/projects/${pid}/theme_options`, { query: q }));

  const sets: SetRec[] = setsRaw.map((s) => ({
    id: s.id,
    name: attrs(s).name,
    set_type: attrs(s).set_type ?? null,
    order_index: attrs(s).order_index ?? null,
  }));
  const setNameById = new Map(sets.map((s) => [s.id, s.name]));

  const tokens: TokenRec[] = tokensRaw.map((t) => {
    const a = attrs(t);
    return {
      id: t.id,
      name: a.name,
      type: a.type ?? null,
      value: a.value,
      description: a.description ?? null,
      token_set_id: a.token_set_id,
      token_set_name: setNameById.get(a.token_set_id) ?? a.token_set_name ?? "(unknown)",
      extensions: a.extensions,
    };
  });

  return {
    pulledAt: new Date().toISOString(),
    projectId: pid,
    branch: branch ?? "main",
    sets,
    tokens,
    themeOptions: themesRaw.map((o) => ({ id: o.id, ...attrs(o) })),
  };
}

/**
 * pull — fetch live → local files. READ-ONLY over the API (GET only); writes local
 * files. Refuses to clobber uncommitted local edits unless `force`.
 */
export async function pull(
  cfg: Config,
  pid: string,
  opts: { branch?: string; force?: boolean } = {}
): Promise<void> {
  // Guard: don't silently overwrite local edits.
  if (existsSync(SNAPSHOT) && !opts.force) {
    const { ops } = computeDiff(readDesired(), readSnapshot());
    if (ops.length > 0) {
      throw new Error(
        `You have ${ops.length} uncommitted local change(s) (see \`tsctl status\`). ` +
          `Pulling would overwrite them. Re-run with --force to discard and re-pull.`
      );
    }
  }

  const snapshot = await fetchLive(cfg, pid, opts.branch);
  const sets = snapshot.sets;
  const tokens = snapshot.tokens;

  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(SNAPSHOT, JSON.stringify(snapshot, null, 2));

  // Editable per-set files + id-map.
  const idMap: Record<string, string> = {};
  const bySet = snapshotBySet(snapshot);
  for (const [setName, toks] of bySet) {
    const obj = {
      $set: setName,
      tokens: {} as Record<string, DesiredToken>,
    };
    for (const t of [...toks.values()].sort((a, b) => a.name.localeCompare(b.name))) {
      const dt: DesiredToken = { $type: t.type, $value: t.value, $description: t.description ?? null };
      const ext = normExt(t.extensions);
      if (ext !== undefined) dt.$extensions = ext; // only carry meaningful Figma metadata (scopes, hiddenFromPublishing)
      obj.tokens[t.name] = dt;
      idMap[`${setName}/${t.name}`] = t.id;
    }
    const file = setFilePath(setName);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, JSON.stringify(obj, null, 2));
  }
  // Prune local set files for sets no longer present live, so `pull` truly mirrors the branch —
  // otherwise a deleted set lingers locally and re-appears as phantom `create` ops / blocks plans.
  const expected = new Set([...bySet.keys()].map((s) => setFilePath(s)));
  let pruned = 0;
  for (const f of walkJson(SETS_DIR)) {
    if (!expected.has(f)) { rmSync(f); pruned++; }
  }
  pruneEmptyDirs(SETS_DIR);
  writeFileSync(ID_MAP, JSON.stringify(idMap, null, 2));
  // Preserve user-configured guard fields (writableSets / protectedBranches) across pulls.
  const prevState = existsSync(STATE) ? JSON.parse(readFileSync(STATE, "utf8")) : {};
  writeFileSync(
    STATE,
    JSON.stringify(
      {
        writableSets: prevState.writableSets ?? [],
        protectedBranches: prevState.protectedBranches ?? [],
        lastPull: snapshot.pulledAt,
        projectId: pid,
        branch: snapshot.branch,
        setCount: sets.length,
        tokenCount: tokens.length,
      },
      null,
      2
    )
  );

  console.log(
    `Pulled ${tokens.length} tokens across ${sets.length} sets from ${snapshot.branch} → tokens-project/` +
      (pruned ? `\n  pruned ${pruned} stale local set file(s) for removed set(s).` : "")
  );
}

/** status — desired vs snapshot. Offline, no writes. */
export function status(): void {
  const snap = readSnapshot();
  const { ops, needsNewSet } = computeDiff(readDesired(), snap);

  if (ops.length === 0) {
    console.log(`Clean — local desired-state matches snapshot (${snap.tokens.length} tokens).`);
  } else {
    const perSet = new Map<string, { c: number; u: number; d: number }>();
    for (const op of ops) {
      const s = perSet.get(op.set) ?? { c: 0, u: 0, d: 0 };
      if (op.kind === "create") s.c++;
      else if (op.kind === "update") s.u++;
      else s.d++;
      perSet.set(op.set, s);
    }
    for (const [set, s] of [...perSet].sort()) {
      console.log(`  ${set}:  +${s.c} create   ~${s.u} update   -${s.d} delete`);
    }
    const c = ops.filter((o) => o.kind === "create").length;
    const u = ops.filter((o) => o.kind === "update").length;
    const d = ops.filter((o) => o.kind === "delete").length;
    console.log(`\nTotal: ${c} to create, ${u} to update, ${d} to delete.`);
  }
  if (needsNewSet.length) {
    console.log(
      `\n⚠️  ${needsNewSet.length} desired set(s) do not exist live: ${needsNewSet.join(", ")}.\n` +
        `    The API cannot create token sets (500 — see API-NOTES §6i); create them in the web UI first.`
    );
  }
  console.log(`\nSnapshot from ${snap.branch} at ${snap.pulledAt}. (No live check — run \`pull\` to refresh.)`);
}

/** plan — write an ordered op list. No live writes (dry-run inherent). */
export function plan(): void {
  const snap = readSnapshot();
  const { ops, needsNewSet } = computeDiff(readDesired(), snap);

  // Order: creates, then updates, then deletes (deletes last, and flagged).
  const order = { create: 0, update: 1, delete: 2 } as const;
  ops.sort((a, b) => order[a.kind] - order[b.kind] || a.set.localeCompare(b.set) || a.name.localeCompare(b.name));

  const deletes = ops.filter((o) => o.kind === "delete");
  const planDoc = {
    builtAt: new Date().toISOString(),
    basedOnSnapshot: snap.pulledAt,
    branch: snap.branch,
    blocked: needsNewSet.length > 0,
    needsNewSet,
    counts: {
      create: ops.filter((o) => o.kind === "create").length,
      update: ops.filter((o) => o.kind === "update").length,
      delete: deletes.length,
    },
    destructive: deletes.length > 0,
    ops,
  };

  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(PLAN_FILE, JSON.stringify(planDoc, null, 2));

  for (const op of ops) {
    if (op.kind === "create") {
      console.log(`  + create  ${op.set}/${op.name} = ${JSON.stringify(op.after?.$value)}`);
    } else if (op.kind === "update") {
      console.log(`  ~ update  ${op.set}/${op.name}  [${op.uuid}]`);
      for (const field of ["$value", "$type", "$description"] as const) {
        if (valuesDiffer(op.before?.[field], op.after?.[field])) {
          console.log(`             ${field}: ${JSON.stringify(op.before?.[field])} → ${JSON.stringify(op.after?.[field])}`);
        }
      }
      if (extDiffer(op.before?.$extensions, op.after?.$extensions)) {
        console.log(`             $extensions: ${JSON.stringify(op.before?.$extensions)} → ${JSON.stringify(op.after?.$extensions)}`);
      }
    } else {
      console.log(`  - DELETE  ${op.set}/${op.name}  [${op.uuid}]`);
    }
  }
  console.log(
    `\nPlan: ${planDoc.counts.create} create, ${planDoc.counts.update} update, ${planDoc.counts.delete} delete → plan.json`
  );
  if (planDoc.destructive)
    console.log(`⚠️  Plan contains deletes — Phase 2 \`apply\` will require --allow-delete.`);
  if (planDoc.blocked)
    console.log(
      `⛔ Plan is BLOCKED: needs new set(s) the API can't create: ${needsNewSet.join(", ")}. ` +
        `Create them in the web UI, then \`pull\` and re-plan.`
    );
  console.log(`\nThis is a dry run — no changes were made to the live project.`);
}

/**
 * snapshot — write a durable, timestamped restore point of current live state to
 * tokens-project/snapshots/. READ-ONLY over the API. These are what `tsw restore` reads.
 */
export async function snapshot(cfg: Config, pid: string, label?: string): Promise<void> {
  const snap = await fetchLive(cfg, pid);
  mkdirSync(SNAP_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const safeLabel = label ? "-" + label.replace(/[^a-zA-Z0-9_-]/g, "_") : "";
  const file = join(SNAP_DIR, `${stamp}${safeLabel}.json`);
  writeFileSync(file, JSON.stringify(snap, null, 2));
  console.log(`Snapshot of ${snap.tokens.length} tokens (${snap.branch}) → snapshots/${stamp}${safeLabel}.json`);
}

/** snapshots — list saved restore points (newest first). */
export function listSnapshots(): void {
  if (!existsSync(SNAP_DIR)) {
    console.log("No snapshots yet. Create one with `tsctl snapshot [--label <name>]`.");
    return;
  }
  const files = readdirSync(SNAP_DIR).filter((f) => f.endsWith(".json")).sort().reverse();
  if (!files.length) {
    console.log("No snapshots yet.");
    return;
  }
  for (const f of files) {
    let n = "?";
    try {
      n = String((JSON.parse(readFileSync(join(SNAP_DIR, f), "utf8")) as Snapshot).tokens.length);
    } catch {
      /* ignore */
    }
    console.log(`  ${f}  (${n} tokens)`);
  }
}

/** diff — print a branch's server-side review/changes (read-only GET). */
export async function diffBranch(cfg: Config, pid: string, branchId: string): Promise<void> {
  const res: any = await apiGet(cfg, `/projects/${pid}/branches/${branchId}/review/changes`);
  const changes = res?.data?.changes ?? {};
  let any = false;
  for (const [entity, arr] of Object.entries(changes)) {
    if (Array.isArray(arr) && arr.length) {
      any = true;
      console.log(`  ${entity}: ${arr.length} changed`);
    }
  }
  if (!any) console.log(`No changes on branch ${branchId} (net-zero vs base).`);
}
