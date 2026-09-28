const { spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')

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

  const toolName = (payload.toolName || '').toLowerCase()
  if (!/write|edit|create|patch/.test(toolName)) {
    process.exit(0)
  }

  const args = payload.toolArgs || {}
  const candidates = []
  const collect = (v) => {
    if (typeof v === 'string') candidates.push(v)
    else if (Array.isArray(v)) v.forEach(collect)
    else if (v && typeof v === 'object') Object.values(v).forEach(collect)
  }
  collect(args)

  const projectDir =
    process.env.GITHUB_WORKSPACE || payload.cwd || process.cwd()

  const run = (cmd, runArgs) => {
    try {
      spawnSync(cmd, runArgs, { cwd: projectDir, stdio: 'pipe' })
    } catch {
      // Best-effort — never block the post-tool flow
    }
  }

  const seen = new Set()
  for (const s of candidates) {
    if (seen.has(s)) continue
    seen.add(s)

    if (s.includes('\n') || s.length > 500) continue

    let abs
    try {
      abs = path.isAbsolute(s) ? s : path.join(projectDir, s)
      if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) continue
    } catch {
      continue
    }

    const ext = path.extname(s)

    if (['.ts', '.tsx'].includes(ext)) {
      run('./node_modules/.bin/eslint', [
        '--fix',
        '--cache',
        '--cache-location',
        'node_modules/.cache/.eslintcache',
        s,
      ])
    }

    if (ext === '.css' && s.includes('/components/next/')) {
      run('./node_modules/.bin/stylelint', ['--fix', '--cache', s])
    }

    // Prettier for the types the linters above don't format. eslint --fix
    // already applies it to .ts/.tsx through eslint-plugin-prettier, and
    // stylelint only fixes ordering and notation — not Prettier's whitespace —
    // so CSS needs this pass too, after stylelint. Prettier reads
    // .prettierignore itself, so ignored paths (e.g. *.mdx) stay untouched.
    if (['.css', '.md'].includes(ext)) {
      run('./node_modules/.bin/prettier', ['--write', '--ignore-unknown', s])
    }
  }

  process.exit(0)
}

main()
