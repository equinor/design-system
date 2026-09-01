import path from 'node:path'
import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Equinor Design System',
  // tagline: 'for mobile and web', Since there is no mobile components for now, we'll temporarily remove this line
  favicon: 'img/eds-logo.svg',

  // // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  // future: {
  //   v4: true, // Improve compatibility with the upcoming Docusaurus v4
  // },

  url: 'https://eds.equinor.com',
  baseUrl: '/',

  organizationName: 'equinor',
  projectName: 'design-system',

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  clientModules: [
    './src/clientModules/syncColorScheme.ts',
    './src/clientModules/pageTransitions.ts',
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // `exclude` replaces Docusaurus's defaults rather than extending
          // them, so GlobExcludeDefault is repeated here. Without it the
          // `_`-prefixed convention stops working — that's what keeps the
          // unwritten component stubs (docs/components/**/_*.md) out of the
          // build, the sidebar, and the search index.
          exclude: [
            '**/_*.{js,jsx,ts,tsx,md,mdx}',
            '**/_*/**',
            '**/*.test.{js,jsx,ts,tsx}',
            '**/__tests__/**',
            '**/tone-guide/**',
          ],
          breadcrumbs: false,
          editUrl:
            'https://github.com/equinor/design-system/tree/main/apps/design-system-docs/',
          versions: {
            current: {
              label: '2.0.0-beta', // Current version label
              path: 'Next', // URL path for the current version
              banner: 'none',
            },
          },
        },
        theme: {
          customCss: [
            './src/css/theme-variables.css',
            './src/css/docs-components.css',
            './src/css/site-chrome.css',
            './src/css/doc-layouts.css',
            './src/css/page-transitions.css',
          ],
        },
        sitemap: {
          lastmod: 'datetime',
        },
      } satisfies Preset.Options,
    ],
  ],
  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        // Basic indexing
        hashed: true,
        indexDocs: true,
        indexPages: true,
        highlightSearchTermsOnTargetPage: true,
        searchResultContextMaxLength: 50,

        // Language and content
        language: ['en'],
        removeDefaultStopWordFilter: false,

        // Advanced features
        docsRouteBasePath: '/docs',

        // UI customization
        searchBarShortcut: true,
        searchBarShortcutHint: true,
        searchBarPosition: 'right',

        // Performance
        explicitSearchResultPath: false,
        searchContextByPaths: [],
      },
    ],
  ],

  plugins: [
    function edsResolverPlugin() {
      return {
        name: 'eds-resolver',
        configureWebpack() {
          return {
            resolve: {
              alias: {
                // Let webpack find EDS workspace packages from the monorepo root
                // so that transitive imports inside built components resolve correctly.
                // Use exact match ($) to avoid breaking subpath imports like /css/variables
                '@equinor/eds-tokens$': path.resolve(
                  __dirname,
                  '../../packages/eds-tokens',
                ),
                '@equinor/eds-icons$': path.resolve(
                  __dirname,
                  '../../packages/eds-icons',
                ),
                '@equinor/eds-utils$': path.resolve(
                  __dirname,
                  '../../packages/eds-utils',
                ),
                // EDS 2.0 (next) is intentionally NOT exposed via the package's
                // `exports` map — that entry is injected only for beta npm
                // releases (see #4395), so stable releases never ship it.
                // Point the docs build straight at the built artifacts so
                // `/next` resolves locally without re-adding the export to
                // source. Requires eds-core-react to be built first.
                '@equinor/eds-core-react/next$': path.resolve(
                  __dirname,
                  '../../packages/eds-core-react/dist/esm-next/index.next.js',
                ),
                '@equinor/eds-core-react/next/index.css$': path.resolve(
                  __dirname,
                  '../../packages/eds-core-react/build/index.css',
                ),
                // The Tokens Studio bundle (ADR-0011) is published on the beta
                // line as `@equinor/eds-tokens/next/css/variables.css` through
                // an exports entry injected by publish_tokens.yaml — like
                // /next above, it is absent from the committed exports map, so
                // point the specifier at the committed source bundle.
                '@equinor/eds-tokens/next/css/variables.css$': path.resolve(
                  __dirname,
                  '../../packages/eds-tokens/src/tokens/css/variables.css',
                ),
                // Portable stories: story files are imported straight from
                // eds-core-react source (stories are not shipped in dist)
                // and rendered via composeStories — see
                // src/components/StoryCanvas.
                '@eds-core-react-src': path.resolve(
                  __dirname,
                  '../../packages/eds-core-react/src',
                ),
                // Several story files import `Stack` from the shared
                // `.storybook/components` barrel, which also re-exports
                // helpers built on Storybook's docs blocks. Those need a
                // Storybook docs context that does not exist here and pull
                // manager internals into the bundle, so resolve them to an
                // inert stub — the stories only ever render `Stack`.
                '@storybook/addon-docs/blocks$': path.resolve(
                  __dirname,
                  'src/stubs/storybook-addon-docs-blocks.tsx',
                ),
              },
              fallback: {
                // eds-utils references Node.js 'url' module (unused in browser)
                url: false,
              },
            },
            module: {
              rules: [
                // Portable stories: transpile eds-core-react source (story
                // files + the components they import) with the same preset
                // Docusaurus uses for site code. Scoped to the package src
                // plus its `.storybook` helpers — which story files import
                // for `Stack` — so it can't affect anything else.
                {
                  test: /\.tsx?$/,
                  include: [
                    path.resolve(
                      __dirname,
                      '../../packages/eds-core-react/src',
                    ),
                    path.resolve(
                      __dirname,
                      '../../packages/eds-core-react/.storybook',
                    ),
                  ],
                  use: {
                    loader: require.resolve('babel-loader'),
                    options: {
                      babelrc: false,
                      configFile: false,
                      presets: [require.resolve('@docusaurus/babel/preset')],
                    },
                  },
                },
                // Story files import their Storybook docs page
                // (`./X.docs.mdx`) for parameters.docs.page — Storybook-
                // flavoured MDX that Docusaurus cannot compile. Import it as
                // an inert source string instead; portable stories never
                // render it.
                {
                  test: /\.docs\.mdx$/,
                  include: path.resolve(
                    __dirname,
                    '../../packages/eds-core-react/src',
                  ),
                  type: 'asset/source',
                },
              ],
            },
          }
        },
      }
    },
  ],

  themeConfig: {
    image: 'img/equinor.png',
    docs: {
      sidebar: {
        // Let readers collapse the sidebar on desktop to give a component doc
        // the full width — useful on the wide story canvases. The control is
        // desktop-only (below 997px the sidebar is already a drawer). The
        // collapsed state is React state, not stored: it survives client-side
        // navigation between docs but resets on a hard reload. This is a
        // themeConfig-level flag, so it applies to every doc sidebar including
        // the 1.1.0 archive — consistent with chrome being version-independent
        // here.
        hideable: true,
      },
    },
    navbar: {
      title: '',
      logo: {
        alt: 'Equinor type Logo',
        src: 'img/eds-logo.svg',
        srcDark: 'img/eds-logo-dark.svg', // Dark mode logo
      },

      items: [
        {
          to: '/foundation',
          label: 'Foundation',
          position: 'right',
        },
        {
          type: 'docSidebar',
          sidebarId: 'componentsSidebar',
          label: 'Components',
          position: 'right',
        },
        {
          type: 'docSidebar',
          sidebarId: 'resourcesSidebar',
          label: 'Resources',
          position: 'right',
        },
        {
          to: '/getting-started',
          label: 'Get started',
          position: 'right',
        },
        {
          type: 'search',
          position: 'right',
        },
        {
          type: 'docsVersionDropdown',
          position: 'left',
          dropdownActiveClassDisabled: true,
        },
      ],
    },
    footer: {
      // Rendered by the swizzled Footer (src/theme/Footer). Internal links use
      // `to`, external links use `href`.
      links: [
        {
          title: 'Get started',
          items: [
            { label: 'Getting Started', to: '/getting-started' },
            {
              label: 'Design',
              to: '/docs/Next/about/getting-started/design/getting_started_design',
            },
            {
              label: 'Develop',
              to: '/docs/Next/about/getting-started/develop/getting_started_development',
            },
            {
              label: 'Citizen developer',
              to: '/docs/Next/about/getting-started/develop/citizen_developers',
            },
            {
              label: 'Team lead',
              to: '/docs/Next/about/getting-started/team_roles',
            },
          ],
        },
        {
          title: 'Foundation',
          items: [
            {
              label: 'Typography',
              to: '/docs/Next/foundation/design-tokens/typography',
            },
            { label: 'Colours', to: '/docs/Next/foundation/colour/intro' },
            {
              label: 'Icons',
              to: '/docs/Next/foundation/assets/system_icons',
            },
            {
              label: 'Spacing',
              to: '/docs/Next/foundation/design-tokens/spacing',
            },
          ],
        },
        {
          title: 'Components',
          items: [
            { label: 'All components', to: '/docs/Next/components' },
            { label: 'Storybook', href: 'https://storybook.eds.equinor.com' },
          ],
        },
        {
          title: 'Resources',
          items: [
            { label: 'About EDS', to: '/about' },
            { label: 'Support', to: '/docs/Next/support' },
          ],
        },
      ],
      copyright: `© Equinor ${new Date().getFullYear()}`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
}

export default config
