import remarkGfm from 'remark-gfm'

const config = {
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },

  stories: [
    '../src/**/*.@(mdx|stories.@(ts|tsx))',
    '../stories/**/*.@(mdx|stories.@(ts|tsx))',
  ],

  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    './remark-gfm-preset.mjs',
    '@storybook/addon-docs',
  ],

  features: {
    interactionsDebugger: true,
    storyStoreV7: true,
    actions: false,
  },

  core: {},

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  refs: (config, { configType }) => {
    if (configType === 'DEVELOPMENT') {
      return {}
    }
    return {
      '@equinor/eds-data-grid-react': {
        title: 'EDS Data grid',
        url: 'https://s478stedsstorybookdatag.z16.web.core.windows.net/',
        expanded: false,
      },
    }
  },

  managerHead: (head) => {
    if (process.env.NODE_ENV === 'development') {
      return head
    }
    return `
      <script async src="https://siteimproveanalytics.com/js/siteanalyze_6003171.js"></script>
     ${head}
  `
  },

  async viteFinal(config) {
    // Vite 8 uses Rolldown + lightningcss for CSS by default. Without explicit
    // targets, lightningcss assumes legacy browsers and downlevels modern
    // syntax — which broke EDS dark-mode tokens in prod Storybook by polyfilling
    // light-dark() into a [data-color-scheme]-incompatible pattern.
    // Resolve targets from the repo browserslist so modern syntax is preserved.
    const browserslist = (await import('browserslist')).default
    const { browserslistToTargets } = await import('lightningcss')

    return {
      ...config,
      css: {
        ...config.css,
        transformer: 'lightningcss',
        lightningcss: {
          ...config.css?.lightningcss,
          targets: browserslistToTargets(browserslist()),
        },
      },
      resolve: {
        ...config.resolve,
        dedupe: ['styled-components', 'react', 'react-dom'],
        alias: {
          ...config.resolve?.alias,
          '@equinor/eds-core-react/style.css': '/dist/style.css',
          '@equinor/eds-core-react/style': '/dist/style.css',
        },
      },
      optimizeDeps: {
        ...config.optimizeDeps,
        include: [
          ...(config.optimizeDeps?.include ?? []),
          '@storybook/addon-docs/mdx-react-shim',
          '@storybook/addon-docs/blocks',
        ],
      },
    }
  },
}

export default config
