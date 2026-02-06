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

  // Check Bash commands for .env references
  if (toolName === 'Bash') {
    const command = toolInput.command || ''
    if (/\.\benv\b/.test(command)) {
      console.error('Blocked: shell command references .env file')
      process.exit(2)
    }
    return
  }

  // Check file paths for Read/Grep/Glob
  const filePath =
    toolInput.file_path || toolInput.path || ''
  const basename = filePath.split('/').pop() || ''

  if (basename === '.env' || basename.startsWith('.env.')) {
    console.error('Blocked: cannot access .env files')
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
