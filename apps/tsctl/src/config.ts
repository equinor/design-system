/**
 * config.ts — loads .env (no dependency) and resolves base URL + project id.
 * Auth is a User JWT obtained by logging in with your password (see user-auth.ts +
 * login.mts), so no API token lives in config. Shared by both the read (tsctl) and
 * write (tsw) CLIs.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

/**
 * Tiny .env loader — no dependency. Only sets keys not already present in the
 * real environment, so exported shell vars / CI secrets win over the file.
 */
function loadDotEnv(): void {
  let raw: string;
  try {
    raw = readFileSync(join(ROOT, ".env"), "utf8");
  } catch {
    return; // no .env file — rely on the process environment
  }
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}

loadDotEnv();

export interface Config {
  baseUrl: string;
  projectId?: string;
}

export function loadConfig(): Config {
  // Auth is a User JWT (see src/user-auth.ts + login.mts); no API token lives here.
  return {
    baseUrl: (process.env.TS_BASE_URL || "https://api-production.tokens.studio/api/v1").replace(/\/$/, ""),
    projectId: process.env.TS_PROJECT_ID || undefined,
  };
}

export function requireProjectId(cfg: Config, override?: string): string {
  const id = override || cfg.projectId;
  if (!id) {
    throw new Error(
      "No project id. Pass --project <id> or set TS_PROJECT_ID in .env (find it with: tsctl projects)."
    );
  }
  return id;
}
