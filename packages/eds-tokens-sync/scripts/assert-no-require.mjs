import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const distDir = './dist'

const jsFiles = readdirSync(distDir, { recursive: true }).filter(
  (f) => typeof f === 'string' && f.endsWith('.js'),
)

// `require` should never appear as a bare identifier in a pure ESM build.
// When rolldown bundles a CJS dep it cannot statically convert, it emits a
// `typeof require < "u" ? require : ...` shim that throws "Calling \`require\` for ..."
// at runtime. The package is "type": "module", so the throw fires on first use.
// Catching the bare identifier covers both that shim and any literal `require(...)` call.
const requireIdentifier = /\brequire\b/

const offenders = jsFiles.filter((f) =>
  requireIdentifier.test(readFileSync(join(distDir, f), 'utf8')),
)

if (offenders.length > 0) {
  throw new Error(
    `ESM dist contains a \`require\` identifier in: ${offenders.join(', ')}. ` +
      `A CJS dependency was bundled into the ESM output and will crash at runtime ` +
      `("Calling \`require\` for ..." from rolldown's CJS shim). ` +
      `Fix by adding the offending package to rolldownOptions.external in vite.config.ts ` +
      `(see PR #4883 for the dotenv precedent).`,
  )
}
