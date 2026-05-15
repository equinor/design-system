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

  const args = payload.toolArgs || {}
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

  const credentialBasename = [
    /^\.env(\..+)?$/,
    /^id_rsa(\.pub)?$/,
    /\.pem$/,
    /\.key$/,
    /^\.?credentials\.json$/,
    /^\.?secrets\.json$/,
  ]
  const secretDir = /(^|\/)secrets\//
  const envInCommand = /\.\benv\b/

  for (const s of strings) {
    const basename = s.split('/').pop() || ''
    if (credentialBasename.some((re) => re.test(basename))) {
      deny(
        `Blocked: access to secret file "${basename}" is not permitted. See AGENTS.md § Secrets & Credentials.`,
      )
    }
    if (secretDir.test(s)) {
      deny(
        'Blocked: access to secrets/ directory is not permitted. See AGENTS.md § Secrets & Credentials.',
      )
    }
    if (envInCommand.test(s)) {
      deny(
        'Blocked: tool input references .env. See AGENTS.md § Secrets & Credentials.',
      )
    }
  }

  process.exit(0)
}

main()
