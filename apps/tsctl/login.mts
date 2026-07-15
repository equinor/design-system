/**
 * login.mts — obtain a User JWT for the write-verification tooling.
 *
 * Usage:  npx tsx login.mts
 *   Prompts for the password (hidden), or reads STUDIO_PASSWORD from the env.
 *   Email defaults to TS_USER_EMAIL, else the known account email.
 *
 * Caches the JWT in .session.local (~23h). probe.mts uses it automatically.
 * Never prints the password or the token.
 */
import { loadConfig } from "./src/config.ts";
import { login, promptHidden } from "./src/user-auth.ts";

const cfg = loadConfig();
const email = process.env.TS_USER_EMAIL || "edbj@equinor.com";

let password = process.env.STUDIO_PASSWORD ?? "";
if (!password) {
  password = await promptHidden(`Password for ${email}: `);
}
if (!password) {
  console.error("No password provided.");
  process.exit(1);
}

await login(cfg, email, password);
console.log(`✓ Logged in as ${email} — user session cached (~23h). Run write probes now.`);
