const { spawnSync } = require('child_process')
const path = require('path')

async function main() {
  const chunks = []
  for await (const chunk of process.stdin) {
    chunks.push(chunk)
  }

  let hookData
  try {
    hookData = JSON.parse(Buffer.concat(chunks).toString())
  } catch {
    process.exit(0)
  }

  const toolName = hookData.tool_name || ''
  if (!['Edit', 'Write'].includes(toolName)) process.exit(0)

  const filePath = hookData.tool_input?.file_path || ''
  if (!filePath) process.exit(0)

  const ext = path.extname(filePath)
  const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd()

  const run = (cmd, args) => {
    try {
      spawnSync(cmd, args, { cwd: projectDir, stdio: 'pipe' })
    } catch {
      // Best-effort — never block the edit
    }
  }

  if (['.ts', '.tsx'].includes(ext)) {
    run('./node_modules/.bin/eslint', [
      '--fix',
      '--cache',
      '--cache-location',
      'node_modules/.cache/.eslintcache',
      filePath,
    ])
  }

  // stylelint only applies to vanilla CSS (next/ components)
  if (ext === '.css' && filePath.includes('/components/next/')) {
    run('./node_modules/.bin/stylelint', ['--fix', '--cache', filePath])
  }
}

main()
