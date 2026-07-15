/**
 * user-auth.ts — the single auth path for both CLIs: log in with your password to
 * get a User JWT.
 *
 * A User JWT acts as the full user — with all of your project permissions, including
 * branch management — which is what the write tooling needs. (An API/service-account
 * token can't create branches; see PROBE-PLAN.md / API-NOTES.md §6a for why.)
 *
 * Flow: POST /auth/login → JWT read from `meta.token`. The JWT is cached to
 * `.session.local` (gitignored via `*.local`, mode 0600) for ~23h, so you enter your
 * password at most once per day. The password and JWT are NEVER logged.
 */
import { readFileSync, writeFileSync, chmodSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Config } from "./config.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SESSION_FILE = join(ROOT, ".session.local");

interface Session {
  jwt: string;
  expires_at: number;
}

/** Return a cached, non-expired user JWT, or null. Never throws. */
export function readSession(): string | null {
  try {
    const s = JSON.parse(readFileSync(SESSION_FILE, "utf8")) as Session;
    if (s.jwt && typeof s.expires_at === "number" && Date.now() < s.expires_at) {
      return s.jwt;
    }
  } catch {
    /* no session / unreadable — fall through */
  }
  return null;
}

/** Return the cached user JWT, or throw a clear "log in first" error. */
export function requireUserJwt(): string {
  const jwt = readSession();
  if (!jwt) {
    throw new Error(
      "No valid user session. Run `npx tsx login.mts` first to log in with your password."
    );
  }
  return jwt;
}

function saveSession(jwt: string, ttlMs: number): void {
  writeFileSync(
    SESSION_FILE,
    JSON.stringify({ jwt, expires_at: Date.now() + ttlMs } satisfies Session),
    { mode: 0o600 }
  );
  try {
    chmodSync(SESSION_FILE, 0o600);
  } catch {
    /* best effort */
  }
}

/**
 * Describe a value's shape — key names + types + string lengths, NEVER values.
 * A JWT shows up as `string(len ~200+)` without exposing the secret.
 */
function describeShape(v: unknown, depth = 0): string {
  if (v === null) return "null";
  if (Array.isArray(v)) return `array[${v.length}]`;
  const t = typeof v;
  if (t === "string") return `string(len ${(v as string).length})`;
  if (t === "object") {
    if (depth >= 2) return "{…}";
    const entries = Object.entries(v as Record<string, unknown>).map(
      ([k, val]) => `${k}: ${describeShape(val, depth + 1)}`
    );
    return `{ ${entries.join(", ")} }`;
  }
  return t;
}

/** Read a line from stdin without echoing it (for password entry). */
export function promptHidden(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stdin = process.stdin;
    if (!stdin.isTTY || typeof stdin.setRawMode !== "function") {
      reject(
        new Error(
          "stdin is not a TTY — run this yourself in a terminal, or set STUDIO_PASSWORD."
        )
      );
      return;
    }
    process.stdout.write(prompt);
    const wasRaw = stdin.isRaw;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    let input = "";
    const done = (fn: () => void) => {
      stdin.setRawMode(wasRaw ?? false);
      stdin.pause();
      stdin.removeListener("data", onData);
      process.stdout.write("\n");
      fn();
    };
    const onData = (chunk: string) => {
      for (const ch of chunk) {
        if (ch === "\n" || ch === "\r" || ch === "\x04") {
          // Enter / EOT — submit
          done(() => resolve(input));
          return;
        } else if (ch === "\x03") {
          // Ctrl-C — cancel
          done(() => reject(new Error("cancelled")));
          return;
        } else if (ch === "\x7f" || ch === "\b") {
          // Backspace / DEL
          input = input.slice(0, -1);
        } else {
          input += ch;
        }
      }
    };
    stdin.on("data", onData);
  });
}

/**
 * Exchange email+password for a user JWT and cache it. Returns the JWT.
 * Never logs the password or the token.
 */
export async function login(cfg: Config, email: string, password: string): Promise<string> {
  const url = `${cfg.baseUrl}/auth/login`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ user: { email, password } }),
    });
  } catch (err) {
    const cause = (err as { cause?: { code?: string } })?.cause;
    throw new Error(`Network error reaching ${new URL(url).host}${cause?.code ? ` (${cause.code})` : ""}`);
  }

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Login failed: HTTP ${res.status} ${res.statusText}. Check the email/password.`);
  }

  // JWT is returned in the Authorization response header (per api-authentication docs).
  const authHeader = res.headers.get("authorization");
  let jwt = authHeader ? authHeader.replace(/^Bearer\s+/i, "").trim() : "";
  if (!jwt) {
    try {
      const b = JSON.parse(text) as Record<string, any>;
      // Real shape (verified live): { data: {...}, meta: { token, refresh_token } }.
      jwt =
        b.meta?.token ||
        b.token ||
        b.access_token ||
        b.jwt ||
        b.data?.token ||
        b.data?.access_token ||
        b.data?.attributes?.token ||
        b.auth_token ||
        b.session_token ||
        "";
    } catch {
      /* not JSON */
    }
  }
  if (!jwt) {
    // Report the response SHAPE (key names + types/lengths, never values) so we can
    // locate where the token lives without ever printing the secret.
    const headerNames = [...res.headers.keys()].join(", ");
    const cookieNames = (res.headers.getSetCookie?.() ?? [])
      .map((c) => c.split("=")[0])
      .join(", ");
    let bodyShape = "(non-JSON body)";
    try {
      bodyShape = describeShape(JSON.parse(text));
    } catch {
      /* keep default */
    }
    throw new Error(
      "Login succeeded but no JWT was found.\n" +
        `  response headers: [${headerNames}]\n` +
        `  set-cookie names: [${cookieNames}]\n` +
        `  body shape: ${bodyShape}`
    );
  }

  // User JWTs live 24h per docs; cache for a hair less so we never present a just-expired token.
  saveSession(jwt, 23 * 60 * 60 * 1000);
  return jwt;
}
