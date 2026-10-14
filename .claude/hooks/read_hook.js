// Secret-file patterns, shared by the Bash and file-path checks below.
// Keep in sync with .github/hooks/block-secrets.js and AGENTS.md § Secrets & Credentials.
// `.env` followed by nothing or a non-word character: `.env.local`,
// `.env-local`, `.env~`, `.env*`. Not `.envrc`, and not `process.env`, which is
// an environment variable, not a file. Leading `*` is allowed because a glob
// `*` can match an empty string, so `*.env` reaches `.env` in ripgrep.
const isEnvBasename = (basename) => /^\**\.env($|\W)/.test(basename)

const credentialPatterns = [
  /^id_(rsa|ed25519|ecdsa|dsa)/,
  /\.pem$/,
  /^\.?credentials\.json$/,
  /^\.?secrets\.json$/,
]

// Only checked on file paths, not in Bash (settings.json skips it too): in
// shell commands `.key` is usually a property (`jq '.key'`, `obj.key`).
const keyFilePattern = /\.key$/

const secretDir = /(^|\/)secrets\//

// Places a secret ends up after it has been used: shell history keeps tokens
// typed on the command line, and VS Code's local history keeps a copy of every
// saved file, `.env` included, under names that don't look like `.env`.
const historyBasename = /^\.(zsh|bash)_history$/
const historyDir = /(^|\/)(\.zsh_sessions|User\/History)(\/|$)/

// Split a shell command into path-like tokens. Quotes and backslashes are
// removed first, as the shell does, so `\.env`, `".env"` and `.en''v` all
// become `.env`. Whitespace, shell operators, `=` (as in `--file=foo.pem`) and
// brace expansion (`{.env,x}`) then separate tokens, so the basename of each
// token can be checked against the same patterns as a file path.
const commandTokens = (command) =>
  command
    .replace(/[\\'"]/g, '')
    .split(/[\s;|&<>()`={},]+/)
    .filter(Boolean)

// Split a Glob pattern or Grep glob filter into segments, so `**/*.pem` and
// `{.env,*.ts}` are checked segment by segment.
const globSegments = (glob) => glob.split(/[/{},]/).filter(Boolean)

const isSecretGlob = (glob) =>
  historyDir.test(glob) ||
  /(^|\/)secrets(\/|$)/.test(glob) ||
  globSegments(glob).some(
    (segment) =>
      isEnvBasename(segment) ||
      keyFilePattern.test(segment) ||
      historyBasename.test(segment) ||
      credentialPatterns.some((p) => p.test(segment)),
  )

async function main() {
  const chunks = []
  for await (const chunk of process.stdin) {
    chunks.push(chunk)
  }

  let toolArgs
  try {
    toolArgs = JSON.parse(Buffer.concat(chunks).toString())
  } catch (e) {
    console.error('Failed to parse hook input:', e.message)
    process.exit(1)
  }

  const toolName = toolArgs.tool_name || ''
  const toolInput = toolArgs.tool_input || {}

  // Check Bash commands for references to any secret-file pattern
  if (toolName === 'Bash') {
    const command = toolInput.command || ''
    for (const token of commandTokens(command)) {
      const tokenBasename = token.split('/').pop() || ''
      if (isEnvBasename(tokenBasename)) {
        console.error('Blocked: shell command references .env file')
        process.exit(2)
      }
      if (credentialPatterns.some((p) => p.test(tokenBasename))) {
        console.error(
          'Blocked: shell command references credential/certificate file',
        )
        process.exit(2)
      }
      if (secretDir.test(token)) {
        console.error('Blocked: shell command references secrets/ directory')
        process.exit(2)
      }
      if (historyBasename.test(tokenBasename) || historyDir.test(token)) {
        console.error(
          'Blocked: shell command references shell or editor history',
        )
        process.exit(2)
      }
    }
    return
  }

  // Check file paths for Read/Grep/Glob/Edit/Write/NotebookEdit
  const filePath =
    toolInput.file_path || toolInput.path || toolInput.notebook_path || ''
  const basename = filePath.split('/').pop() || ''

  if (isEnvBasename(basename)) {
    console.error('Blocked: cannot access .env files')
    process.exit(2)
  }

  // Unlike secretDir, also match a path that ends in `secrets`, since Grep and
  // Glob pass directories without a trailing slash. Bash can't do this, or
  // `grep -r secrets src` would be blocked.
  if (/(^|\/)secrets(\/|$)/.test(filePath)) {
    console.error('Blocked: cannot access secrets/ directory')
    process.exit(2)
  }

  // Block common credential/certificate file patterns
  if (
    keyFilePattern.test(basename) ||
    credentialPatterns.some((p) => p.test(basename))
  ) {
    console.error('Blocked: cannot access credential/certificate files')
    process.exit(2)
  }

  if (historyBasename.test(basename) || historyDir.test(filePath)) {
    console.error('Blocked: cannot access shell or editor history')
    process.exit(2)
  }

  // For Glob, check the pattern. Keep the broad `.env` substring check, since
  // a glob is never search text.
  if (toolName === 'Glob') {
    const pattern = toolInput.pattern || ''
    if (/\.env/.test(pattern) || isSecretGlob(pattern)) {
      console.error('Blocked: glob pattern targets secret files')
      process.exit(2)
    }
  }

  // For Grep, check the glob filter as well as the path above. The pattern is
  // the text being searched for, so `process.env` there is fine.
  if (toolName === 'Grep') {
    const glob = toolInput.glob || ''
    if (isSecretGlob(glob)) {
      console.error('Blocked: grep glob targets secret files')
      process.exit(2)
    }
  }
}

main()
