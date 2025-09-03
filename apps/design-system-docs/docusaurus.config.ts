/* eslint-disable import/no-default-export */
import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Design System Documentation',
  tagline: 'both for mobile and web',
  favicon: 'img/equinor.png',

  // // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  // future: {
  //   v4: true, // Improve compatibility with the upcoming Docusaurus v4
  // },

  url: 'https://equinor.github.io',
  baseUrl: '/design-system/',

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
          breadcrumbs: true,
          editUrl:
            'https://github.com/equinor/design-system/tree/develop/apps/design-system-docs/shared',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/equinor.png', //change to new eds social card
    navbar: {
      title: 'Equinor Design System',
      logo: {
        alt: 'Equinor hat Logo',
        src: 'img/equinor.png',
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
          href: 'https://github.com/equinor/design-system',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      logo: {
        alt: 'Equinor Logo',
        src: 'img/equinor.png',
      },
      links: [
        {
          title: 'Equinor',
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Equinor.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
}

export default config
