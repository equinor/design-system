/**
 * write-client.ts — the ONLY module that issues POST/PATCH/DELETE against the API.
 * Kept separate from the read-only `client.ts` so `bin/tsctl` stays GET-only.
 *
 * Every data mutation must carry a scratch-branch `changeSetId`; the guard refuses
 * missing or protected (main / colour-branch) targets before anything is sent.
 * Auth is the User JWT. See guards.ts + WRITE-LAYER-PLAN §4.
 */
import type { Config } from "./config.ts";
import { requireUserJwt } from "./user-auth.ts";
import { isProtectedBranch } from "./guards.ts";

type Method = "POST" | "PATCH" | "DELETE";

interface MutateOpts {
  /** Scratch-branch change_set_id. Required for token/set/theme mutations. */
  changeSetId?: string;
  body?: unknown;
  /** Set true only for branch lifecycle ops (create/archive) that carry no change_set_id. */
  branchLevel?: boolean;
}

let cachedJwt: string | null = null;

/** Path fragments that indicate a data mutation (must be branch-scoped). */
function isDataMutation(path: string): boolean {
  return /\/(tokens|token_sets|theme_options|theme_groups)(\/|\?|$)/.test(path);
}

export async function mutate(
  cfg: Config,
  method: Method,
  path: string,
  opts: MutateOpts = {}
): Promise<any> {
  // ── Guards (fail before any network call) ──────────────────────────────────
  if (/\/merge\b/.test(path)) {
    throw new Error("Refusing to call a merge endpoint — merge is Phase 3 and human-only.");
  }
  if (isProtectedBranch(opts.changeSetId)) {
    throw new Error(
      `Refusing to write to protected branch ${opts.changeSetId} (main / colour branch). ` +
        `Writes must target a scratch branch.`
    );
  }
  if (isDataMutation(path) && !opts.changeSetId) {
    throw new Error(
      `Refusing to mutate ${path} without a scratch-branch change_set_id — ` +
        `this would write main. Pass a branch.`
    );
  }
  // Branch archive must not target a protected branch.
  const archiveMatch = path.match(/\/branches\/([0-9a-f-]{36})\/archive/);
  if (archiveMatch && isProtectedBranch(archiveMatch[1])) {
    throw new Error(`Refusing to archive protected branch ${archiveMatch[1]}.`);
  }

  // ── Build + send ───────────────────────────────────────────────────────────
  if (!cachedJwt) cachedJwt = requireUserJwt();
  const url = new URL(cfg.baseUrl + (path.startsWith("/") ? path : `/${path}`));
  if (opts.changeSetId) url.searchParams.set("change_set_id", opts.changeSetId);

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${cachedJwt}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    });
  } catch (err) {
    const cause = (err as { cause?: { code?: string } })?.cause;
    throw new Error(`Network error reaching ${url.host}${cause?.code ? ` (${cause.code})` : ""} — ${method} ${url.pathname}`);
  }

  const text = await res.text();
  let parsed: unknown = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = text;
  }
  if (!res.ok) {
    const detail = typeof parsed === "object" ? JSON.stringify(parsed) : String(parsed);
    throw new Error(`HTTP ${res.status} ${res.statusText} — ${method} ${url.pathname}\n${detail}`);
  }
  return parsed;
}
