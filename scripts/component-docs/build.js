const fs = require('fs')
const path = require('path')
const { rootDir, PLATFORMS } = require('./config')
const { fail } = require('./errors')
const {
  locate,
  githubUrl,
  findPropsDeclaration,
  readFigmaUrl,
  docsPageUrl,
} = require('./locate')
const { readSidecar } = require('./sidecar')
const { extractProps } = require('./props')
const { extractStories } = require('./stories')
const { renderWeb, renderMobile } = require('./render')

// En and em dashes are not allowed in the docs. Better to stop here than to
// publish them.
function assertNoDashes({ file, content }) {
  const line = content.split('\n').findIndex((l) => /[–—]/.test(l))
  if (line !== -1) {
    fail(
      `${path.relative(rootDir, file)}:${line + 1} contains an en or em dash. Fix it in the source (types JSDoc, story caption or the .docs.md sidecar).`,
    )
  }
}

// A prop without a description would print as an empty bullet.
function assertPropsDocumented(component, props) {
  const missing = props.filter((p) => !p.description).map((p) => p.name)
  if (missing.length) {
    fail(
      `${component}: add a JSDoc description to ${missing.map((n) => `\`${n}\``).join(', ')} in ${component}Props.`,
    )
  }
}

// The pages to write for one component: always the web page, plus the React
// Native one when the mobile folder has a sidecar.
function buildPages(project, component) {
  const found = {
    web: locate(PLATFORMS.web, component),
    mobile: locate(PLATFORMS.mobile, component),
  }
  if (!found.web) fail(`${component}: no web component found`)
  const hasMobile =
    found.mobile !== null &&
    fs.existsSync(path.join(found.mobile.dir, `${component}.docs.md`))

  const pages = []
  for (const [platform, cfg] of Object.entries(PLATFORMS)) {
    if (platform === 'mobile' && !hasMobile) continue
    const { dir, file } = found[platform]
    const props = extractProps(findPropsDeclaration(project, dir, component))
    assertPropsDocumented(component, props)
    const { sections: sidecar, links } = readSidecar(
      path.join(dir, `${component}.docs.md`),
      cfg,
    )
    const ctx = {
      relDir: path.relative(rootDir, dir),
      props,
      stories: extractStories(
        project,
        path.join(dir, `${component}.stories.tsx`),
        cfg.skipStories,
      ),
      sidecar,
      figmaUrl: readFigmaUrl(found.web.dir, component),
      docsUrl: docsPageUrl(component, links.docs),
      ariaUrl: links.aria,
      sourceUrl: githubUrl(file),
      mobileSourceUrl: hasMobile ? githubUrl(found.mobile.file) : undefined,
      hasMobile,
    }
    const content =
      platform === 'web'
        ? renderWeb(component, ctx)
        : renderMobile(component, ctx)
    pages.push({ file: path.join(rootDir, cfg.out(component)), content })
  }

  pages.forEach(assertNoDashes)
  return pages
}

module.exports = { buildPages }
