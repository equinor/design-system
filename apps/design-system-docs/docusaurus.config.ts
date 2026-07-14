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

  url: 'https://equinor.github.io',
  baseUrl: '/',

  organizationName: 'equinor',
  projectName: 'design-system',

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  clientModules: ['./src/clientModules/syncColorScheme.ts'],

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
          exclude: ['**/tone-guide/**'],
          breadcrumbs: true,
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
          customCss: ['./src/css/custom.css', './src/css/docs-components.css'],
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
              },
              fallback: {
                // eds-utils references Node.js 'url' module (unused in browser)
                url: false,
              },
            },
          }
        },
      }
    },
  ],

  themeConfig: {
    image: 'img/equinor.png',
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
