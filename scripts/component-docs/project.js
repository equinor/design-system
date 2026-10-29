const path = require('path')
const { Project } = require('ts-morph')
const { rootDir, PLATFORMS } = require('./config')

// Props are read from types that import each other, such as mobile TextField's
// `& InputProps` from `../Input`. A source file the project has not been given
// is not read reliably, so that base type becomes `any` and the page says the
// component has no props of its own. Loading every component up front keeps the
// result the same for one component or all of them, in any order.
function createProject() {
  const project = new Project({ skipAddingFilesFromTsConfig: true })
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
