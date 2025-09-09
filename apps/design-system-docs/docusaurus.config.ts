import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Equinor Design System',
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
          customCss: [
            './src/css/custom.css',
            // Add additional CSS files here
            './src/css/eds_static.css',
          ],
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
        src: 'img/equinor_logo.svg',
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
        /* {
          href: 'https://github.com/equinor/design-system',
          label: 'GitHub',
          position: 'right',
        }, */
      ],
    },
    footer: {
      links: [
        {
          items: [
            {
              html: `
              <a class="footer-icon" href="https://figma.com"
              target="_blank" rel="noreferrer noopener" aria-label="X">
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M15.3232 1.375C17.5045 1.37509 19.2713 3.14978 19.2715 5.33301C19.2715 6.73194 18.5452 7.96186 17.4502 8.66602C18.5455 9.37011 19.2715 10.6008 19.2715 12C19.2715 14.1834 17.5047 15.9579 15.3232 15.958C14.2794 15.9579 13.3308 15.5508 12.625 14.8877V18.667C12.6248 20.8503 10.8572 22.625 8.67578 22.625C6.49472 22.6246 4.72772 20.85 4.72754 18.667C4.72754 17.2683 5.45322 16.0372 6.54785 15.333C5.45338 14.6287 4.72754 13.3985 4.72754 12C4.72754 10.6013 5.45313 9.37023 6.54785 8.66602C5.45347 7.96174 4.72754 6.73148 4.72754 5.33301C4.72772 3.14996 6.49472 1.37538 8.67578 1.375H15.3232ZM8.67578 15.958C7.18844 15.9584 5.97754 17.1707 5.97754 18.667C5.97771 20.1632 7.18855 21.3746 8.67578 21.375C10.1633 21.375 11.3748 20.1634 11.375 18.667V15.958H8.67578ZM8.67578 9.29199C7.18844 9.29238 5.97754 10.5037 5.97754 12C5.97754 13.4963 7.18844 14.7076 8.67578 14.708H11.375V9.29199H8.67578ZM15.3232 9.29199C13.8358 9.29223 12.625 10.5036 12.625 12L12.6387 12.2773C12.7773 13.6433 13.9289 14.7078 15.3232 14.708C16.8108 14.7079 18.0215 13.4965 18.0215 12C18.0215 10.5035 16.8108 9.29208 15.3232 9.29199ZM8.67578 2.625C7.18855 2.62538 5.97772 3.83683 5.97754 5.33301C5.97754 6.82933 7.18844 8.04161 8.67578 8.04199H11.375V2.625H8.67578ZM12.625 8.04199H15.3232L15.5986 8.02734C16.9574 7.88867 18.0215 6.73599 18.0215 5.33301C18.0213 3.83665 16.8107 2.62509 15.3232 2.625H12.625V8.04199Z"/>
</svg>

              </a>`,
            },
            {
              html: `
              <a class="footer-icon" href="https://github.com/equinor/design-system"
              target="_blank" rel="noreferrer noopener" aria-label="GitHub">
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path
              d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2.17c-3.19.69-3.86-1.37-3.86-1.37-.53-1.33-1.3-1.68-1.3-1.68-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.74 1.26 3.41.96.11-.76.41-1.26.75-1.55-2.55-.29-5.22-1.28-5.22-5.7 0-1.26.45-2.29 1.2-3.1-.12-.29-.52-1.46.11-3.04 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.82 0c2.22-1.49 3.2-1.18 3.2-1.18.63 1.58.23 2.75.11 3.04.75.81 1.2 1.84 1.2 3.1 0 4.43-2.68 5.41-5.23 5.7.43.37.81 1.09.81 2.2v3.25c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .5Z"/>
              </svg>
              </a>`,
            },
          ],
        },
      ],
      copyright: `Equinor`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
}

export default config
