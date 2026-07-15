/**
 * guards.ts — the hard safety boundary for all live writes (WRITE-LAYER-PLAN §4).
 *
 * These constants and checks are the last line of defense against overwriting or
 * destroying existing tokens. Every mutating request passes through here.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATE = join(__dirname, "..", "tokens-project", ".tsctl-state.json");

/** main — must NEVER be written by anything but an explicit, human-approved merge. */
export const MAIN_CHANGE_SET_ID = "f5d7e80d-2909-4871-998f-58b3567a6ea7";

/**
 * Change-set ids that write ops must refuse to target. main + Edvard's colour
 * branch (877 tokens — never touch). Extendable via .tsctl-state.json `protectedBranches`.
 */
const DEFAULT_PROTECTED = new Set<string>([
  MAIN_CHANGE_SET_ID,
  "fbe1da69-e412-4bbf-aa95-cdb99673eabc", // add-semantic-color
]);

function loadState(): Record<string, any> {
  if (!existsSync(STATE)) return {};
  try {
    return JSON.parse(readFileSync(STATE, "utf8"));
  } catch {
    return {};
  }
}

export function protectedBranches(): Set<string> {
  const extra: string[] = loadState().protectedBranches ?? [];
  return new Set([...DEFAULT_PROTECTED, ...extra]);
}

export function isProtectedBranch(changeSetId: string | undefined): boolean {
  return !!changeSetId && protectedBranches().has(changeSetId);
}

/**
 * Sets the tool is allowed to write. Empty/unset = NOTHING is writable — the caller
 * must name intended sets explicitly (via --allow-set), forcing deliberate intent.
 */
export function writableSets(): Set<string> {
  return new Set<string>(loadState().writableSets ?? []);
}

/** Deletes/recreates above this in one apply require an extra explicit confirmation. */
export const DESTRUCTIVE_THRESHOLD = 5;
