const path = require('path')
const { Project, ts } = require('ts-morph')
const { rootDir, PLATFORMS } = require('./config')

// Props are read from types that import each other, such as mobile TextField's
// `& InputProps` from `../Input`. A source file the project has not been given
// is not read reliably, so that base type becomes `any` and the page says the
// component has no props of its own. Loading every component up front keeps the
// result the same for one component or all of them, in any order.
function createProject() {
  // Bundler resolution reads a package's `exports` map. React Native 0.88 has no
  // top-level `types` field and lists its types only under `exports`, so with
  // the default resolution `react-native` is not found, `ViewProps` becomes
  // `any`, and every mobile page says the component has no props.
  const project = new Project({
    skipAddingFilesFromTsConfig: true,
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
    },
  })
  for (const { componentsRoot } of Object.values(PLATFORMS)) {
    const root = path.join(rootDir, componentsRoot)
    project.addSourceFilesAtPaths([
      `${root}/**/*.{ts,tsx}`,
      `!${root}/**/*.{test,stories}.{ts,tsx}`,
      `!${root}/**/node_modules/**`,
    ])
  }
  return project
}

module.exports = { createProject }
