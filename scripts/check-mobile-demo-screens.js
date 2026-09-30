#!/usr/bin/env node

/**
 * Checks that every component exported by @equinor/eds-mobile-components has
 * a demo screen in apps/mobile-storybook.
 *
 * Unlike web, where Storybook discovers colocated stories, the mobile demo app
 * is hand-built: a component only appears in the app if it has a screen file
 * and an entry in apps/mobile-storybook/lib/registry.ts. Nothing fails if you
 * forget, so this script does.
 *
 * It fails when:
 *   1. A component folder re-exported from the library barrel has no registry
 *      entry (and is not in NO_DEMO_SCREEN).
 *   2. A registry entry has no screen file.
 *   3. A screen file has no registry entry.
 *   4. A NO_DEMO_SCREEN entry is no longer exported, so the list stays honest.
 *
 * The registry `route` must be the lowercased component folder name.
 *
 * Run via `pnpm run check-screens:mobile`. Wired into the Checks workflow
 * when mobile files change.
 */

const fs = require('fs')
const path = require('path')

const rootDir = path.resolve(__dirname, '..')
const barrelPath = path.join(
  rootDir,
  'packages/eds-mobile-components/src/index.ts',
)
const registryPath = path.join(rootDir, 'apps/mobile-storybook/lib/registry.ts')
const screensDir = path.join(
  rootDir,
  'apps/mobile-storybook/app/(tabs)/components',
)

// Component folders that are exported but are not shown in the demo app.
// Keep the reason next to each entry.
const NO_DEMO_SCREEN = {
  EDSProvider: 'app infrastructure, wraps the whole app',
  ErrorBoundary: 'infrastructure, renders nothing of its own',
  Portal: 'infrastructure, mounts children elsewhere',
  PressableHighlight: 'internal building block of other components',
  // TODO: remove when the Icon screen lands (#5560), the check then enforces it.
  Icon: 'temporary, screen not yet written',
}

// Files in the screens folder that are routes' plumbing, not demo screens.
const NON_SCREEN_FILES = new Set(['index', '_layout'])

const barrel = fs.readFileSync(barrelPath, 'utf8')
const exportedFolders = [
  ...barrel.matchAll(/export \* from ['"]\.\/components\/([^'"/]+)['"]/g),
].map((match) => match[1])

const registry = fs.readFileSync(registryPath, 'utf8')
const registeredRoutes = [
  ...registry.matchAll(/route:\s*['"]([^'"]+)['"]/g),
].map((match) => match[1])

const screenFiles = fs
  .readdirSync(screensDir)
  .filter((file) => file.endsWith('.tsx'))
  .map((file) => file.replace(/\.tsx$/, ''))
  .filter((name) => !NON_SCREEN_FILES.has(name))

const errors = []

// The parser above only understands `export * from './components/X'`. Fail
// loudly on any other export form from components/ rather than silently
// skipping that component.
const componentExportLines = barrel
  .split('\n')
  .filter((line) => /^\s*export\b.*from\s+['"]\.\/components\//.test(line))
if (componentExportLines.length !== exportedFolders.length) {
  errors.push(
    `src/index.ts has ${componentExportLines.length} export lines from ./components/ but only ${exportedFolders.length} use the supported form \`export * from "./components/X"\`. Use that form, or update scripts/check-mobile-demo-screens.js to parse the new one.`,
  )
}

for (const folder of exportedFolders) {
  if (folder in NO_DEMO_SCREEN) continue
  if (!registeredRoutes.includes(folder.toLowerCase())) {
    errors.push(
      `${folder} is exported from eds-mobile-components but has no entry in apps/mobile-storybook/lib/registry.ts (expected route "${folder.toLowerCase()}"). Add a screen and a registry entry, or add it to NO_DEMO_SCREEN in this script with a reason.`,
    )
  }
}

const duplicateRoutes = new Set(
  registeredRoutes.filter(
    (route, index) => registeredRoutes.indexOf(route) !== index,
  ),
)
for (const route of duplicateRoutes) {
  errors.push(
    `Registry has more than one entry with route "${route}". Each route must appear once in apps/mobile-storybook/lib/registry.ts.`,
  )
}

for (const route of registeredRoutes) {
  if (!screenFiles.includes(route)) {
    errors.push(
      `Registry entry "${route}" has no screen file at apps/mobile-storybook/app/(tabs)/components/${route}.tsx.`,
    )
  }
}

for (const screen of screenFiles) {
  if (!registeredRoutes.includes(screen)) {
    errors.push(
      `Screen file ${screen}.tsx has no entry in apps/mobile-storybook/lib/registry.ts, so it is not listed in the app.`,
    )
  }
}

for (const folder of Object.keys(NO_DEMO_SCREEN)) {
  if (!exportedFolders.includes(folder)) {
    errors.push(
      `NO_DEMO_SCREEN lists ${folder}, which is no longer exported from eds-mobile-components. Remove it from scripts/check-mobile-demo-screens.js.`,
    )
  }
  if (registeredRoutes.includes(folder.toLowerCase())) {
    errors.push(
      `${folder} now has a registry entry but is still in NO_DEMO_SCREEN. Remove it from scripts/check-mobile-demo-screens.js so the check enforces its screen.`,
    )
  }
}

if (errors.length > 0) {
  console.error('Mobile demo screens are out of sync:\n')
  for (const error of errors) console.error(`  - ${error}`)
  process.exit(1)
}

console.log(
  `Mobile demo screens OK (${registeredRoutes.length} registered, ${Object.keys(NO_DEMO_SCREEN).length} skipped).`,
)
