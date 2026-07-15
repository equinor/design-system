/**
 * apply.ts — Phase 2 live-write commands (WRITE-LAYER-PLAN §3/§4).
 *
 * Everything here writes ONLY to a scratch branch, dry-run by default, through the
 * guarded write-client. The safety sequence for `apply`:
 *   1. load a reviewed plan.json     (from `tsctl plan`)
 *   2. refuse if blocked / disallowed set / deletes without --allow-delete / over threshold
 *   3. DRIFT CHECK — re-pull live, verify each op's precondition still holds
 *   4. snapshot the current live state (restore point)
 *   5. execute on the scratch branch (PATCH-by-UUID; never recreate)
 *   6. verify via review/changes
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Config } from "./config.ts";
import { apiGet } from "./client.ts";
import { fetchLive } from "./sync.ts";
import { mutate } from "./write-client.ts";
import { writableSets, DESTRUCTIVE_THRESHOLD, isProtectedBranch } from "./guards.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "tokens-project");
const SNAPSHOT = join(DATA_DIR, "snapshot.json");
const PLAN_FILE = join(DATA_DIR, "plan.json");
const SNAP_DIR = join(DATA_DIR, "snapshots");

const UUID_RE = /^[0-9a-f-]{36}$/;
const attrs = (i: any): any => i?.attributes ?? {};
function asArray(d: unknown): any[] {
  if (Array.isArray(d)) return d;
  const v = d && typeof d === "object" ? (d as any).data : null;
  return Array.isArray(v) ? v : [];
}

export interface ApplyOpts {
  branch: string; // scratch branch name (created) or existing change_set_id
  yes: boolean;
  allowDelete: boolean;
  allowSets: string[];
  forceDestructive: boolean;
}

// ── branch lifecycle ─────────────────────────────────────────────────────────

export async function branchList(cfg: Config, pid: string): Promise<void> {
  const branches = asArray(await apiGet(cfg, `/projects/${pid}/branches`));
  for (const b of branches) {
    const a = attrs(b);
    console.log(`  ${a.is_main ? "*" : " "} ${b.id}  ${a.status.padEnd(8)}  ${a.name}`);
  }
}

export async function branchNew(cfg: Config, pid: string, name: string): Promise<string> {
  // Branch name must be sent FLAT ({name}); the wrapped {branch:{name}} form is
  // ignored and the API auto-generates a name (verified live 2026-07-03).
  const res = await mutate(cfg, "POST", `/projects/${pid}/branches`, {
    branchLevel: true,
    body: { name },
  });
  const id = res?.data?.id as string;
  console.log(`Created branch "${attrs(res.data).name}" → ${id} (based on ${attrs(res.data).based_on_change_set_id})`);
  return id;
}

export async function branchArchive(cfg: Config, pid: string, id: string): Promise<void> {
  await mutate(cfg, "POST", `/projects/${pid}/branches/${id}/archive`, { branchLevel: true, body: {} });
  console.log(`Archived branch ${id}.`);
}

/** Resolve --branch: a uuid = existing branch; anything else = create a new scratch branch. */
async function resolveBranch(cfg: Config, pid: string, arg: string): Promise<string> {
  if (UUID_RE.test(arg)) {
    if (isProtectedBranch(arg)) throw new Error(`Refusing to target protected branch ${arg}.`);
    return arg;
  }
  return branchNew(cfg, pid, arg);
}

/** Execute a set of ops on a branch: creates (POST), updates (batch_update), deletes (DELETE). */
async function executeOps(
  cfg: Config,
  pid: string,
  branchId: string,
  ops: PlanOp[],
  setIdByName: Map<string, string>
): Promise<void> {
  for (const op of ops.filter((o) => o.kind === "create")) {
    const setId = setIdByName.get(op.set);
    if (!setId) throw new Error(`No set id for ${op.set} — cannot create ${op.name}.`);
    const token: Record<string, any> = { name: op.name, type: op.after!.$type, value: op.after!.$value, token_set_id: setId };
    if (op.after!.$extensions !== undefined) token.extensions = op.after!.$extensions;
    await mutate(cfg, "POST", `/projects/${pid}/tokens`, {
      changeSetId: branchId,
      body: { token },
    });
  }
  const updates = ops
    .filter((o) => o.kind === "update")
    .map((o) => {
      const changes: Record<string, any> = {};
      if (JSON.stringify(o.before?.$value) !== JSON.stringify(o.after?.$value)) changes.value = o.after!.$value;
      if (JSON.stringify(o.before?.$type) !== JSON.stringify(o.after?.$type)) changes.type = o.after!.$type;
      if ((o.before?.$description ?? null) !== (o.after?.$description ?? null)) changes.description = o.after!.$description ?? null;
      // extensions (Figma scopes / hiddenFromPublishing). API replaces the object, so send the full desired shape ({} clears it).
      if (JSON.stringify(o.before?.$extensions ?? null) !== JSON.stringify(o.after?.$extensions ?? null)) changes.extensions = o.after?.$extensions ?? {};
      return { token_id: o.uuid, changes };
    });
  if (updates.length) {
    await mutate(cfg, "POST", `/projects/${pid}/tokens/batch_update`, { changeSetId: branchId, body: { updates } });
  }
  for (const op of ops.filter((o) => o.kind === "delete")) {
    await mutate(cfg, "DELETE", `/projects/${pid}/tokens/${op.uuid}`, { changeSetId: branchId });
  }
}

/** Read a branch's review/changes and return the token-change count. */
async function verifyBranch(cfg: Config, pid: string, branchId: string): Promise<number> {
  const review: any = await apiGet(cfg, `/projects/${pid}/branches/${branchId}/review/changes`);
  return review?.data?.changes?.tokens?.length ?? 0;
}

// ── apply ─────────────────────────────────────────────────────────────────────

interface PlanOp {
  kind: "create" | "update" | "delete";
  set: string;
  name: string;
  uuid?: string;
  before?: { $type: any; $value: any; $description: any; $extensions?: any };
  after?: { $type: any; $value: any; $description: any; $extensions?: any };
}

function loadPlan(): any {
  if (!existsSync(PLAN_FILE)) throw new Error("No plan.json — run `tsctl plan` first.");
  return JSON.parse(readFileSync(PLAN_FILE, "utf8"));
}

/** Re-pull live main tokens and confirm every op's precondition still holds. */
async function driftCheck(cfg: Config, pid: string, ops: PlanOp[]): Promise<any[]> {
  const live = asArray(await apiGet(cfg, `/projects/${pid}/tokens`)); // main
  const byUuid = new Map<string, any>();
  const byKey = new Map<string, any>(); // "<setName>/<name>"
  const setNameById = new Map<string, string>(
    asArray(await apiGet(cfg, `/projects/${pid}/token_sets`)).map((s) => [s.id, attrs(s).name])
  );
  for (const t of live) {
    const a = attrs(t);
    byUuid.set(t.id, a);
    byKey.set(`${setNameById.get(a.token_set_id) ?? a.token_set_name}/${a.name}`, a);
  }
  const drift: string[] = [];
  for (const op of ops) {
    if (op.kind === "create") {
      if (byKey.has(`${op.set}/${op.name}`)) drift.push(`create ${op.set}/${op.name}: already exists live`);
    } else {
      const a = op.uuid ? byUuid.get(op.uuid) : undefined;
      if (!a) drift.push(`${op.kind} ${op.set}/${op.name}: uuid ${op.uuid} no longer on live`);
      else if (op.kind === "update" && op.before) {
        if (JSON.stringify(a.value) !== JSON.stringify(op.before.$value) || (a.description ?? null) !== (op.before.$description ?? null))
          drift.push(`update ${op.set}/${op.name}: live value/description changed since plan`);
      }
    }
  }
  if (drift.length) {
    throw new Error(
      `DRIFT DETECTED — live changed since the plan was built:\n  ${drift.join("\n  ")}\n` +
        `Re-run \`tsctl pull\` and \`tsctl plan\`, then apply again.`
    );
  }
  return live;
}

export async function apply(cfg: Config, pid: string, opts: ApplyOpts): Promise<void> {
  const plan = loadPlan();
  const ops: PlanOp[] = plan.ops ?? [];

  // ── static guards ────────────────────────────────────────────────────────
  if (plan.blocked) {
    throw new Error(`Plan is BLOCKED (needs a set the API can't create: ${plan.needsNewSet?.join(", ")}). Aborting.`);
  }
  if (ops.length === 0) {
    console.log("Nothing to apply — plan is empty.");
    return;
  }
  const touchedSets = [...new Set(ops.map((o) => o.set))];
  const deletes = ops.filter((o) => o.kind === "delete");

  // ── dry run always previews (no guard errors) ──────────────────────────────
  console.log(`Plan: ${plan.counts.create} create, ${plan.counts.update} update, ${plan.counts.delete} delete.`);
  console.log(`Target sets: ${touchedSets.join(", ")}`);
  if (!opts.yes) {
    console.log(`\nDRY RUN — re-run with --yes to execute on branch "${opts.branch}". Nothing was written.`);
    return;
  }

  // ── write guards (enforced only for real execution) ────────────────────────
  const allowed = new Set([...writableSets(), ...opts.allowSets]);
  const notAllowed = touchedSets.filter((s) => !allowed.has(s));
  if (notAllowed.length) {
    throw new Error(
      `These sets are not writable: ${notAllowed.join(", ")}.\n` +
        `Name them explicitly with --allow-set <set> (repeatable), or add to .tsctl-state.json writableSets.`
    );
  }
  if (deletes.length && !opts.allowDelete) {
    throw new Error(`Plan has ${deletes.length} delete(s). Re-run with --allow-delete to permit them.`);
  }
  if (deletes.length > DESTRUCTIVE_THRESHOLD && !opts.forceDestructive) {
    throw new Error(
      `Plan deletes ${deletes.length} tokens (> ${DESTRUCTIVE_THRESHOLD}). ` +
        `Re-run with --force-destructive to confirm this large deletion.`
    );
  }

  // ── validate branch target early (before any read/snapshot) ────────────────
  if (UUID_RE.test(opts.branch) && isProtectedBranch(opts.branch)) {
    throw new Error(`Refusing to target protected branch ${opts.branch}.`);
  }

  // ── drift check + snapshot + execute ───────────────────────────────────────
  console.log("Checking live for drift…");
  const live = await driftCheck(cfg, pid, ops);

  mkdirSync(SNAP_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  writeFileSync(join(SNAP_DIR, `pre-apply-${stamp}.json`), JSON.stringify(live, null, 2));
  console.log(`Snapshotted current live → tokens-project/snapshots/pre-apply-${stamp}.json`);

  const branchId = await resolveBranch(cfg, pid, opts.branch);
  console.log(`Applying on branch ${branchId}…`);

  // set name → id (for creates), from snapshot
  const snap = JSON.parse(readFileSync(SNAPSHOT, "utf8"));
  const setIdByName = new Map<string, string>(snap.sets.map((s: any) => [s.name, s.id]));

  await executeOps(cfg, pid, branchId, ops, setIdByName);

  const changed = await verifyBranch(cfg, pid, branchId);
  console.log(`\n✓ Applied on branch ${branchId}. review/changes reports ${changed} token change(s).`);
  console.log(`Review it in Tokens Studio, then merge manually. Branch is isolated — archive it to discard.`);
}

// ── single-token imperative ────────────────────────────────────────────────────

function parseRef(ref: string): { set: string; name: string } {
  const i = ref.lastIndexOf("/");
  if (i === -1) throw new Error(`Ref must be "<set>/<token-name>", got "${ref}".`);
  return { set: ref.slice(0, i), name: ref.slice(i + 1) };
}

export async function setToken(
  cfg: Config,
  pid: string,
  ref: string,
  value: string,
  opts: { branch: string; type?: string; yes: boolean; allowSets: string[]; scopes?: string[]; hidden?: boolean }
): Promise<void> {
  const { set, name } = parseRef(ref);
  const allowed = new Set([...writableSets(), ...opts.allowSets]);
  if (!allowed.has(set)) throw new Error(`Set ${set} not writable — pass --allow-set ${set}.`);

  const snap = JSON.parse(readFileSync(SNAPSHOT, "utf8"));
  const setId = new Map<string, string>(snap.sets.map((s: any) => [s.name, s.id])).get(set);
  if (!setId) throw new Error(`No set id for ${set} (create the set in the web UI first).`);
  const existing = snap.tokens.find((t: any) => t.token_set_name === set && t.name === name);

  // Figma extensions — built only when --scopes (or an explicit --hidden) is given.
  // Sent as the FULL object (the API replaces, not merges — API-NOTES §6g).
  const figma: Record<string, any> = {};
  if (opts.scopes) figma.scopes = opts.scopes;
  if (opts.hidden !== undefined) figma.hiddenFromPublishing = opts.hidden;
  const extensions = Object.keys(figma).length ? { "com.figma": figma } : undefined;
  const scopeNote = extensions ? `  scopes=[${opts.scopes?.join(",") ?? ""}]${opts.hidden !== undefined ? ` hidden=${opts.hidden}` : ""}` : "";

  console.log((existing ? `~ update ${ref} = ${value} [${existing.id}]` : `+ create ${ref} = ${value}`) + scopeNote);
  if (!opts.yes) {
    console.log(`DRY RUN — re-run with --yes to write on "${opts.branch}".`);
    return;
  }
  const branchId = await resolveBranch(cfg, pid, opts.branch);
  if (existing) {
    const token: Record<string, any> = { value };
    if (extensions) token.extensions = extensions;
    await mutate(cfg, "PATCH", `/projects/${pid}/tokens/${existing.id}`, {
      changeSetId: branchId,
      body: { token },
    });
  } else {
    const token: Record<string, any> = { name, type: opts.type ?? existing?.type ?? "other", value, token_set_id: setId };
    if (extensions) token.extensions = extensions;
    await mutate(cfg, "POST", `/projects/${pid}/tokens`, {
      changeSetId: branchId,
      body: { token },
    });
  }
  console.log(`✓ Wrote ${ref} on branch ${branchId}.`);
}

// ── restore ────────────────────────────────────────────────────────────────────

export interface RestoreOpts {
  branch: string;
  yes: boolean;
  allowDelete: boolean;
  allowSets: string[];
  allowAllSets: boolean;
  forceDestructive: boolean;
}

/** Resolve a snapshot ref: explicit path, a name under snapshots/, or "latest". */
function resolveSnapshotFile(ref: string): string {
  if (existsSync(ref)) return ref;
  const inDir = join(SNAP_DIR, ref);
  if (existsSync(inDir)) return inDir;
  if (existsSync(inDir + ".json")) return inDir + ".json";
  if (ref === "latest" && existsSync(SNAP_DIR)) {
    const files = readdirSync(SNAP_DIR).filter((f) => f.endsWith(".json")).sort();
    if (files.length) return join(SNAP_DIR, files[files.length - 1]);
  }
  throw new Error(`Snapshot not found: ${ref}. List available with \`tsctl snapshots\`.`);
}

interface TargetTok {
  uuid: string;
  set: string;
  name: string;
  type: any;
  value: any;
  description: any;
}

/** Accept either the pull-style { tokens: [...] } shape or a raw JSON:API token array. */
function normalizeSnapshot(json: any): TargetTok[] {
  const arr = Array.isArray(json) ? json : json.tokens;
  if (!Array.isArray(arr)) throw new Error("Unrecognized snapshot shape (no token array).");
  return arr.map((t: any) => {
    const a = t.attributes ?? t;
    return {
      uuid: t.id,
      set: a.token_set_name ?? "(unknown)",
      name: a.name,
      type: a.type ?? null,
      value: a.value,
      description: a.description ?? null,
    };
  });
}

/**
 * restore — bring live back to a saved snapshot, as minimal ops on a scratch branch.
 * PATCH-by-UUID for value reverts; tokens deleted since the snapshot are RECREATED
 * (with a NEW uuid — the original Figma connection can't be resurrected). Tokens added
 * since the snapshot are deleted. Never writes main; lands on a branch for review.
 */
export async function restore(cfg: Config, pid: string, ref: string, opts: RestoreOpts): Promise<void> {
  const file = resolveSnapshotFile(ref);
  const target = normalizeSnapshot(JSON.parse(readFileSync(file, "utf8")));

  const live = await fetchLive(cfg, pid);
  const liveByUuid = new Map<string, any>(live.tokens.map((t) => [t.id, t]));
  const setIdByName = new Map<string, string>(live.sets.map((s) => [s.name, s.id]));
  const targetUuids = new Set(target.map((t) => t.uuid));

  const ops: PlanOp[] = [];
  const resurrected: string[] = [];
  for (const t of target) {
    const l = liveByUuid.get(t.uuid);
    if (l) {
      if (
        JSON.stringify(l.value) !== JSON.stringify(t.value) ||
        (l.type ?? null) !== (t.type ?? null) ||
        (l.description ?? null) !== (t.description ?? null)
      ) {
        ops.push({
          kind: "update",
          set: t.set,
          name: t.name,
          uuid: t.uuid,
          before: { $type: l.type, $value: l.value, $description: l.description ?? null },
          after: { $type: t.type, $value: t.value, $description: t.description ?? null },
        });
      }
    } else {
      ops.push({ kind: "create", set: t.set, name: t.name, after: { $type: t.type, $value: t.value, $description: t.description ?? null } });
      resurrected.push(`${t.set}/${t.name}`);
    }
  }
  for (const l of live.tokens) {
    if (!targetUuids.has(l.id)) {
      ops.push({ kind: "delete", set: l.token_set_name, name: l.name, uuid: l.id, before: { $type: l.type, $value: l.value, $description: l.description ?? null } });
    }
  }

  if (ops.length === 0) {
    console.log(`Live already matches ${file} — nothing to restore.`);
    return;
  }

  const touchedSets = [...new Set(ops.map((o) => o.set))];
  const deletes = ops.filter((o) => o.kind === "delete");
  const c = ops.filter((o) => o.kind === "create").length;
  const u = ops.filter((o) => o.kind === "update").length;

  // ── dry run always previews (no guard errors) ──────────────────────────────
  console.log(`Restore to ${file}:`);
  console.log(`  ${u} revert(s), ${c} recreate(s), ${deletes.length} delete(s) across ${touchedSets.length} set(s).`);
  if (resurrected.length) {
    console.log(`  ⚠️  ${resurrected.length} token(s) were deleted since the snapshot and will be RECREATED with NEW uuids`);
    console.log(`      (original Figma variable connections cannot be resurrected): ${resurrected.slice(0, 8).join(", ")}${resurrected.length > 8 ? " …" : ""}`);
  }
  if (!opts.yes) {
    console.log(`\nDRY RUN — re-run with --yes to write on branch "${opts.branch}". Nothing was written.`);
    return;
  }

  // ── write guards (enforced only for real execution) ────────────────────────
  if (!opts.allowAllSets) {
    const allowed = new Set([...writableSets(), ...opts.allowSets]);
    const notAllowed = touchedSets.filter((s) => !allowed.has(s));
    if (notAllowed.length) {
      throw new Error(
        `Restore touches sets not writable: ${notAllowed.join(", ")}.\n` +
          `Pass --allow-set <s> per set, or --allow-all-sets for a full rollback.`
      );
    }
  }
  if (deletes.length && !opts.allowDelete) {
    throw new Error(`Restore would delete ${deletes.length} token(s) added since the snapshot. Re-run with --allow-delete.`);
  }
  if (deletes.length + resurrected.length > DESTRUCTIVE_THRESHOLD && !opts.forceDestructive) {
    throw new Error(
      `Restore is large: ${deletes.length} delete(s) + ${resurrected.length} recreate(s) > ${DESTRUCTIVE_THRESHOLD}. ` +
        `Re-run with --force-destructive to confirm.`
    );
  }

  if (UUID_RE.test(opts.branch) && isProtectedBranch(opts.branch)) {
    throw new Error(`Refusing to target protected branch ${opts.branch}.`);
  }
  // Snapshot the pre-restore live state too (so the restore itself is reversible).
  mkdirSync(SNAP_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  writeFileSync(join(SNAP_DIR, `pre-restore-${stamp}.json`), JSON.stringify(live, null, 2));
  console.log(`Snapshotted current live → snapshots/pre-restore-${stamp}.json`);

  const branchId = await resolveBranch(cfg, pid, opts.branch);
  console.log(`Restoring on branch ${branchId}…`);
  await executeOps(cfg, pid, branchId, ops, setIdByName);
  const changed = await verifyBranch(cfg, pid, branchId);
  console.log(`\n✓ Restored on branch ${branchId}. review/changes reports ${changed} token change(s).`);
  console.log(`Review it in Tokens Studio, then merge manually. Branch is isolated — archive it to discard.`);
}

export async function rmToken(
  cfg: Config,
  pid: string,
  ref: string,
  opts: { branch: string; yes: boolean; allowSets: string[] }
): Promise<void> {
  const { set, name } = parseRef(ref);
  const allowed = new Set([...writableSets(), ...opts.allowSets]);
  if (!allowed.has(set)) throw new Error(`Set ${set} not writable — pass --allow-set ${set}.`);

  const snap = JSON.parse(readFileSync(SNAPSHOT, "utf8"));
  const existing = snap.tokens.find((t: any) => t.token_set_name === set && t.name === name);
  if (!existing) throw new Error(`${ref} not found in snapshot — nothing to delete.`);

  console.log(`- DELETE ${ref} [${existing.id}]`);
  if (!opts.yes) {
    console.log(`DRY RUN — re-run with --yes to delete on "${opts.branch}".`);
    return;
  }
  const branchId = await resolveBranch(cfg, pid, opts.branch);
  await mutate(cfg, "DELETE", `/projects/${pid}/tokens/${existing.id}`, { changeSetId: branchId });
  console.log(`✓ Deleted ${ref} on branch ${branchId}.`);
}
