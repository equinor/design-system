import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Design System Documentation',
  tagline: 'for both mobile and web',
  favicon: 'img/favicon.ico',

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
    image: 'img/docusaurus-social-card.jpg', //change to new eds social card
    navbar: {
      title: 'Equinor Design System',
      logo: {
        alt: 'eds Logo',
        src: 'img/logo.svg', //TODO: replace with new eds logo
      },

      items: [
        {
          type: 'dropdown',
          position: 'left',
          label: 'EDS to the world',
          items: [
            {
              type: 'docSidebar',
              sidebarId: 'aboutSidebar',
              label: 'About EDS',
            },
            {
              type: 'docSidebar',
              sidebarId: 'componentsSidebar',
              label: 'Getting Started',
            },
            {
              type: 'docSidebar',
              sidebarId: 'foundationSidebar',
              label: 'EDS Foundation',
            },
            {
              type: 'docSidebar',
              sidebarId: 'imagesSidebar',
              label: 'Meet the Team',
            },
            {
              type: 'docSidebar',
              sidebarId: 'resourcesSidebar',
              label: 'Resources',
            },
            {
              type: 'docSidebar',
              sidebarId: 'supportSidebar',
              label: 'Support Channels',
            },
            // {
            //   type: 'docSidebar',
            //   sidebarId: 'packagesSidebar',
            //   label: 'Packages',
            // },
            // {
            //   type: 'docSidebar',
            //   sidebarId: 'labReactSidebar',
            //   label: 'EDS Lab React',
            // },
            // {
            //   type: 'docSidebar',
            //   sidebarId: 'tokensSidebar',
            //   label: 'EDS Tokens',
            // },
            // {
            //   type: 'docSidebar',
            //   sidebarId: 'tokensBuildSidebar',
            //   label: 'EDS Tokens Build',
            // },
            // {
            //   type: 'docSidebar',
            //   sidebarId: 'utilsSidebar',
            //   label: 'EDS Utils',
            // },
          ],
        },
        { to: '/blog', label: 'Blog', position: 'left' },
        {
          href: 'https://github.com/equinor/design-system',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Packages',
          items: [
            {
              label: 'EDS Components',
              to: 'design-system-docs/components/getting-started',
            },
            {
              label: 'EDS Color Palette Generator',
              to: 'design-system-docs/eds-color-palette-generator/introduction',
            },
            {
              label: 'EDS Core React',
              to: 'design-system-docs/eds-core-react/introduction',
            },
            {
              label: 'EDS Data Grid React',
              to: 'design-system-docs/eds-data-grid-react/introduction',
            },
            {
              label: 'EDS Icons',
              to: 'design-system-docs/eds-icons/introduction',
            },
            {
              label: 'EDS Lab React',
              to: 'design-system-docs/eds-lab-react/introduction',
            },
            {
              label: 'EDS Tokens',
              to: 'design-system-docs/eds-tokens/introduction',
            },
            {
              label: 'EDS Tokens Build',
              to: 'design-system-docs/eds-tokens-build/introduction',
            },
            {
              label: 'EDS Utils',
              to: 'design-system-docs/eds-utils/introduction',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/equinor/design-system',
            }, // we can add our sharepoint and  Figma pages perhaps?
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Equinor. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
}

export default config
