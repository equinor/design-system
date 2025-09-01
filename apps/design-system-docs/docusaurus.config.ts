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

  // Set the production url of your site here
  url: 'https://equinor.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/design-system/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'equinor', // Usually your GitHub org/user name.
  projectName: 'design-system', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
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
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/equinor/design-system/tree/develop/apps/design-system-docs/shared',
        },
        // blog: {
        //   showReadingTime: true,
        //   feedOptions: {
        //     type: ['rss', 'atom'],
        //     xslt: true,
        //   },
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   editUrl:
        //     'https://github.com/equinor/design-system/tree/develop/apps/design-system-docs/shared',
        //   // Useful options to enforce blogging best practices
        //   onInlineTags: 'warn',
        //   onInlineAuthors: 'warn',
        //   onUntruncatedBlogPosts: 'warn',
        // },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
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
