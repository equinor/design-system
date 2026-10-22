const path = require('path')

const rootDir = path.resolve(__dirname, '../..')

const BETA_CALLOUT =
  '**Beta:** safe to adopt alongside EDS 1.0. The API may still change in small ways before EDS 2.0 becomes stable. See [About EDS 2.0](?path=/docs/eds-2-0-beta-about--docs) for what beta means.'

// Related components: omitted from the page when absent. Every other section
// is required, see requiredSections per platform below.
const OPTIONAL_SIDECAR_SECTIONS = ['Related components']

// Mobile sub-components that share their parent's page and get their own props
// table under Props, keyed by the parent. `component` is the name whose
// `{component}Props` type lists the props, so Button.Icon reads IconButtonProps.
const MOBILE_SUB_COMPONENTS = {
  Button: [{ name: 'Button.Icon', component: 'IconButton' }],
}

// Where each React Native props type is documented, for the "Also accepts all
// React Native ..." line under a mobile props table. A type missing here is
// named without a link.
const REACT_NATIVE_DOCS = {
  PressableProps: 'pressable',
  TextInputProps: 'textinput',
  TextProps: 'text',
  ViewProps: 'view',
}

// Optional metadata block at the top of a sidecar. These become buttons in the
// Links row; they are not content, so they never render as a section.
const SIDECAR_METADATA_KEYS = ['aria', 'docs']

const DOCS_SITE = 'https://eds.equinor.com/docs/Next/components'
const DOCS_SITE_DIR = 'apps/design-system-docs/docs/components'
const GITHUB_BLOB = 'https://github.com/equinor/design-system/blob/main'

const PLATFORMS = {
  web: {
    componentsRoot: 'packages/eds-core-react/src/components/next',
    out: (c) =>
      `packages/eds-core-react/src/components/next/${c}/${c}.docs.mdx`,
    importLine: (c) => `import { ${c} } from '@equinor/eds-core-react/next'`,
    installLine: 'npm install @equinor/eds-core-react@beta',
    npmUrl: 'https://www.npmjs.com/package/@equinor/eds-core-react',
    skipStories: new Set(['Introduction']),
    // The summary is written once, here, and shown above both tabs.
    requiredSections: ['Summary', 'Features', 'Usage', 'Accessibility'],
  },
  mobile: {
    componentsRoot: 'packages/eds-mobile-components/src/components',
    out: (c) => `packages/eds-mobile-components/docs/${c}.mdx`,
    importLine: (c) => `import { ${c} } from '@equinor/eds-mobile-components'`,
    installLine: 'npm install @equinor/eds-mobile-components',
    npmUrl: 'https://www.npmjs.com/package/@equinor/eds-mobile-components',
    skipStories: new Set(),
    // No Summary: the web sidecar's summary sits above the React Native tab.
    requiredSections: ['Features', 'Usage', 'Accessibility'],
  },
}

module.exports = {
  rootDir,
  BETA_CALLOUT,
  OPTIONAL_SIDECAR_SECTIONS,
  MOBILE_SUB_COMPONENTS,
  REACT_NATIVE_DOCS,
  SIDECAR_METADATA_KEYS,
  DOCS_SITE,
  DOCS_SITE_DIR,
  GITHUB_BLOB,
  PLATFORMS,
}
