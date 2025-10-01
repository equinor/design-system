import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Equinor Design System',
  tagline: 'both for mobile and web',
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
            'https://github.com/equinor/design-system/tree/develop/apps/design-system-docs/shared',
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

  themeConfig: {
    image: 'img/equinor.png',
    navbar: {
      title: 'Equinor Design System',
      logo: {
        alt: 'Equinor type Logo',
        src: 'img/eds-logo.svg',
        srcDark: 'img/eds-logo-dark.svg', // Dark mode logo
      },

      items: [
        {
          type: 'docSidebar',
          sidebarId: 'aboutSidebar',
          label: 'About EDS',
          position: 'right',
        },
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
          type: 'docSidebar',
          sidebarId: 'supportSidebar',
          label: 'Support',
          position: 'right',
        },
        {
          type: 'search',
          position: 'right',
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
