// Secret-file patterns. Keep in sync with .claude/hooks/read_hook.js and
// AGENTS.md § Secrets & Credentials.
// `.env` followed by nothing or a non-word character: `.env.local`,
// `.env-local`, `.env~`, `.env*`. Not `.envrc`, and not `process.env`, which is
// an environment variable, not a file. Leading `*` is allowed because a glob
// `*` can match an empty string, so `*.env` reaches `.env` in ripgrep.
const envBasename = /^\**\.env($|\W)/

const credentialPatterns = [
  envBasename,
  /^id_(rsa|ed25519|ecdsa|dsa)/,
  /\.pem$/,
  /^\.?credentials\.json$/,
  /^\.?secrets\.json$/,
  // Shell history keeps tokens typed on the command line.
  /^\.(zsh|bash)_history$/,
]

// Only checked on a whole value without whitespace (a file path), not on each
// word: in commands and code `.key` is usually a property (`jq '.key'`,
// `obj.key`).
const keyFilePattern = /\.key$/

const secretDir = /(^|\/)secrets\//

// Zsh session history, and VS Code's local history, which keeps a copy of
// every saved file, `.env` included, under names that don't look like `.env`.
const historyDir = /(^|\/)(\.zsh_sessions|User\/History)(\/|$)/

// Split a value into path-like tokens. Quotes and backslashes are removed
// first, as the shell does, so `\.env`, `".env"` and `.en''v` all become
// `.env`. Whitespace, shell operators, `=` (as in `--file=foo.pem`) and brace
// expansion (`{.env,x}`) then separate tokens, so the basename of each token
// can be checked against the same patterns as a file path. Same split as
// commandTokens in .claude/hooks/read_hook.js.
const tokens = (value) =>
  value
    .replace(/[\\'"]/g, '')
    .split(/[\s;|&<>()`={},]+/)
    .filter(Boolean)

const basenameOf = (value) => value.split('/').pop() || ''

async function main() {
  const chunks = []
  for await (const chunk of process.stdin) {
    chunks.push(chunk)
  }

  let payload
  try {
    payload = JSON.parse(Buffer.concat(chunks).toString())
  } catch {
    process.exit(0)
  }

  let args = payload.toolArgs || {}
  // Copilot CLI may pass toolArgs as a JSON string.
  if (typeof args === 'string') {
    try {
      args = JSON.parse(args)
    } catch {
      // Not JSON, check it as a plain string.
    }
  }

  const strings = []
  const collect = (v) => {
    if (typeof v === 'string') strings.push(v)
    else if (Array.isArray(v)) v.forEach(collect)
    else if (v && typeof v === 'object') Object.values(v).forEach(collect)
  }
  collect(args)

  const deny = (reason) => {
    process.stdout.write(
      JSON.stringify({
        permissionDecision: 'deny',
        permissionDecisionReason: reason,
      }),
    )
    process.exit(0)
  }

  for (const s of strings) {
    if (!/\s/.test(s) && keyFilePattern.test(basenameOf(s))) {
      deny(
        `Blocked: access to secret file "${basenameOf(s)}" is not permitted. See AGENTS.md § Secrets & Credentials.`,
      )
    }
    for (const token of tokens(s)) {
      const basename = basenameOf(token)
      if (credentialPatterns.some((re) => re.test(basename))) {
        deny(
          `Blocked: access to secret file "${basename}" is not permitted. See AGENTS.md § Secrets & Credentials.`,
        )
      }
      if (secretDir.test(token)) {
        deny(
          'Blocked: access to secrets/ directory is not permitted. See AGENTS.md § Secrets & Credentials.',
        )
      }
      if (historyDir.test(token)) {
        deny(
          'Blocked: access to shell or editor history is not permitted. See AGENTS.md § Secrets & Credentials.',
        )
      }
    }
  }

  process.exit(0)
}

main()
