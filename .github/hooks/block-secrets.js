// Secret-file patterns. Keep in sync with .claude/hooks/read_hook.js and
// AGENTS.md § Secrets & Credentials.
// `.env` followed by nothing or a non-word character: `.env.local`,
// `.env-local`, `.env~`, `.env*`. Not `.envrc`, and not `process.env`, which is
// an environment variable, not a file.
const envBasename = /^\.env($|\W)/

const credentialPatterns = [
  envBasename,
  /^id_(rsa|ed25519|ecdsa|dsa)/,
  /\.pem$/,
  /^\.?credentials\.json$/,
  /^\.?secrets\.json$/,
]

// Only checked on a whole value without whitespace (a file path), not on each
// word: in commands and code `.key` is usually a property (`jq '.key'`,
// `obj.key`).
const keyFilePattern = /\.key$/

const secretDir = /(^|\/)secrets\//

// Split a value into path-like tokens. Whitespace, shell operators, quotes, `=`
// (as in `--file=foo.pem`) and brace expansion (`{.env,x}`) separate tokens, so
// the basename of each token can be checked against the same patterns as a
// file path. Same split as commandTokens in .claude/hooks/read_hook.js.
const tokens = (value) => value.split(/[\s;|&<>()`'"={},]+/).filter(Boolean)

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
    }
  }

  process.exit(0)
}

main()
