// Secret-file patterns, shared by the Bash and file-path checks below.
// Keep in sync with .github/hooks/block-secrets.js and AGENTS.md § Secrets & Credentials.
const isEnvBasename = (basename) =>
  basename === '.env' || basename.startsWith('.env.')

const credentialPatterns = [
  /^id_rsa(\.pub)?$/,
  /\.pem$/,
  /\.key$/,
  /^\.?credentials\.json$/,
  /^\.?secrets\.json$/,
]

const secretDir = /(^|\/)secrets\//

// Split a shell command into path-like tokens. Whitespace, shell operators,
// quotes and `=` (as in `--file=foo.pem`) separate tokens, so the basename of
// each token can be checked against the same patterns as a file path.
const commandTokens = (command) =>
  command.split(/[\s;|&<>()`'"=]+/).filter(Boolean)

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
    if (/\.\benv\b/.test(command)) {
      console.error('Blocked: shell command references .env file')
      process.exit(2)
    }
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

  // Block common credential/certificate file patterns
  if (credentialPatterns.some((p) => p.test(basename))) {
    console.error('Blocked: cannot access credential/certificate files')
    process.exit(2)
  }

  // For Glob, check the pattern field
  if (toolName === 'Glob') {
    const pattern = toolInput.pattern || ''
    if (/\.env/.test(pattern)) {
      console.error('Blocked: glob pattern targets .env files')
      process.exit(2)
    }
  }

  // For Grep, also check the glob/pattern for .env targeting
  if (toolName === 'Grep') {
    const pattern = toolInput.pattern || ''
    if (/\.\benv\b/.test(pattern)) {
      console.error('Blocked: grep pattern targets .env files')
      process.exit(2)
    }
  }
}

main()
