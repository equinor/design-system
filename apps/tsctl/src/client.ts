/**
 * client.ts — the READ-ONLY HTTP client (GET only). Used by every `tsctl` command.
 * There is deliberately no POST/PATCH/DELETE code path here, so pointing tsctl at the
 * live project cannot change anything. Auth = User JWT via requireUserJwt(). Live
 * mutations go through the separate write-client.ts (used only by `tsw`).
 */
import type { Config } from "./config.ts";
import { requireUserJwt } from "./user-auth.ts";

export interface GetOptions {
  query?: Record<string, string | string[] | undefined>;
}

/**
 * Bearer for all requests: the cached User JWT from `login.mts` (`.session.local`),
 * which carries full user permissions. Resolved once and cached for the lifetime
 * of the process.
 */
let sessionToken: string | null = null;

function buildUrl(cfg: Config, path: string, opts: GetOptions): URL {
  const url = new URL(cfg.baseUrl + (path.startsWith("/") ? path : `/${path}`));
  for (const [key, value] of Object.entries(opts.query ?? {})) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const v of value) url.searchParams.append(`${key}[]`, v);
    } else {
      url.searchParams.set(key, value);
    }
  }
  return url;
}

async function doGet(url: URL, bearer: string): Promise<Response> {
  try {
    return await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${bearer}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  } catch (err) {
    const cause = (err as { cause?: { code?: string } })?.cause;
    const detail = cause?.code ? ` (${cause.code})` : "";
    throw new Error(`Network error reaching ${url.host}${detail} — GET ${url.pathname}`);
  }
}

/**
 * GET-only HTTP client. This CLI is deliberately read-only: there is no method
 * to issue a data-mutating POST/PATCH/DELETE, so pointing it at the live project
 * cannot change anything.
 *
 * Auth: the cached User JWT only. A 401 means the session is missing/expired —
 * surfaced as a clear "log in again" error.
 */
export async function apiGet<T = unknown>(
  cfg: Config,
  path: string,
  opts: GetOptions = {}
): Promise<T> {
  const url = buildUrl(cfg, path, opts);

  if (!sessionToken) sessionToken = requireUserJwt();

  const res = await doGet(url, sessionToken);

  if (res.status === 401) {
    throw new Error(
      `HTTP 401 — user session rejected (likely expired). Run \`npx tsx login.mts\` again. — GET ${url.pathname}`
    );
  }

  const text = await res.text();
  let body: unknown;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!res.ok) {
    const detail =
      body && typeof body === "object" ? JSON.stringify(body) : String(body);
    throw new Error(`HTTP ${res.status} ${res.statusText} — GET ${url.pathname}\n${detail}`);
  }

  return body as T;
}
