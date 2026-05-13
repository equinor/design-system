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
  onBrokenMarkdownLinks: 'warn',

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
          exclude:
            process.env.NODE_ENV === 'production' ||
            process.env.NODE_ENV === 'development'
              ? ['**/tone-guide/**']
              : [],
          breadcrumbs: true,
          editUrl:
            'https://github.com/equinor/design-system/tree/main/apps/design-system-docs/shared',
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
            './src/css/custom.css',
            // Add additional CSS files here
          ],
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
          type: 'docSidebar',
          sidebarId: 'foundationSidebar',
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
      links: [
        {
          items: [
            {
              to: 'https://www.figma.com/',
              label: 'EDS Figma',
              className: 'figma',
            },
            {
              to: 'https://www.github.com/equinor/design-system',
              label: 'EDS Github',
              className: 'github',
            },
          ],
        },
      ],
      copyright: `Equinor ${new Date().getFullYear()} `,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
}

export default config
