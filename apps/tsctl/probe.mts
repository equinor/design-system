/**
 * probe.mts — temporary live-verification harness for the WRITE endpoints.
 *
 * Usage: npx tsx probe.mts <METHOD> <path> [json-body]
 *   {PID} in the path expands to TS_PROJECT_ID.
 *
 * Prints: HTTP status + response body (truncated). Never prints the JWT.
 * Safety: every invocation is a single explicit request driven from the shell —
 * nothing here loops, retries writes, or touches paths on its own.
 */
import { loadConfig, requireProjectId } from "./src/config.ts";
import { requireUserJwt } from "./src/user-auth.ts";

const [method, rawPath, body] = process.argv.slice(2);
if (!method || !rawPath) {
  console.error("usage: probe.mts <METHOD> <path> [json-body]");
  process.exit(1);
}

const cfg = loadConfig();
const pid = requireProjectId(cfg);
const path = rawPath.replace("{PID}", pid);

// Auth is the cached User JWT (full user permissions — can create branches).
// Run `login.mts` first.
const jwt = requireUserJwt();
console.error("[auth: user session]");

const res = await fetch(cfg.baseUrl + path, {
  method: method.toUpperCase(),
  headers: {
    Authorization: `Bearer ${jwt}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  body: body ?? undefined,
});

const text = await res.text();
console.log(`HTTP ${res.status} ${res.statusText} — ${method.toUpperCase()} ${path}`);
try {
  console.log(JSON.stringify(JSON.parse(text), null, 2).slice(0, 6000));
} catch {
  console.log(text.slice(0, 2000));
}
process.exitCode = res.ok ? 0 : 2;
