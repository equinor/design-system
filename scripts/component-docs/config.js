const path = require('path')

const rootDir = path.resolve(__dirname, '../..')

const BETA_CALLOUT =
  '**Beta:** safe to adopt alongside EDS 1.0. The API may still change in small ways before EDS 2.0 becomes stable. See [About EDS 2.0](?path=/docs/eds-2-0-beta-about--docs) for what beta means.'

const SIDECAR_SECTIONS = ['Summary', 'Usage', 'Accessibility']

// Features: hand-written bullets added after the ones generated from the props
// (required when the component has no props). Related components: omitted from
// the page when absent. Links: `- ARIA: <url>` and `- Docs: <page>` lines.
const OPTIONAL_SIDECAR_SECTIONS = ['Features', 'Related components', 'Links']

const DOCS_SITE = 'https://eds.equinor.com/docs/Next/components'
const DOCS_SITE_DIR = 'apps/design-system-docs/docs/components'
const GITHUB_BLOB = 'https://github.com/equinor/design-system/blob/main'

const NUMBER_WORDS = [
  'Zero',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
]

const PLATFORMS = {
  web: {
    componentsRoot: 'packages/eds-core-react/src/components/next',
    out: (c) =>
      `packages/eds-core-react/src/components/next/${c}/${c}.docs.mdx`,
    importLine: (c) => `import { ${c} } from '@equinor/eds-core-react/next'`,
    installLine: 'npm install @equinor/eds-core-react@beta',
    npmUrl: 'https://www.npmjs.com/package/@equinor/eds-core-react',
    skipStories: new Set(['Introduction']),
  },
  mobile: {
    componentsRoot: 'packages/eds-mobile-components/src/components',
    out: (c) => `packages/eds-mobile-components/docs/${c}.mdx`,
    importLine: (c) => `import { ${c} } from '@equinor/eds-mobile-components'`,
    installLine: 'npm install @equinor/eds-mobile-components',
    npmUrl: 'https://www.npmjs.com/package/@equinor/eds-mobile-components',
    skipStories: new Set(),
  },
}

module.exports = {
  rootDir,
  BETA_CALLOUT,
  SIDECAR_SECTIONS,
  OPTIONAL_SIDECAR_SECTIONS,
  DOCS_SITE,
  DOCS_SITE_DIR,
  GITHUB_BLOB,
  NUMBER_WORDS,
  PLATFORMS,
}
