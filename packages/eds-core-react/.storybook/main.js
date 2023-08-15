import remarkGfm from 'remark-gfm'

const config = {
  stories: [
    '../src/**/*.stories.@(ts|tsx|mdx)',
    '../stories/**/*.stories.@(ts|tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    '@storybook/addon-actions',
    {
      name: '@storybook/addon-essentials',
      options: {
        docs: false,
        actions: false,
      },
    },
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
  ],
  features: {
    interactionsDebugger: true,
    storyStoreV7: true,
  },
  core: {
    builder: '@storybook/builder-vite',
  },

  framework: {
    name: '@storybook/react-vite',
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
    return {
      ...config,
      resolve: {
        ...config.resolve,
        dedupe: ['styled-components'],
      },
      optimizeDeps: {
        ...config.optimizeDeps,
        include: [
          ...(config.optimizeDeps?.include ?? []),
          '@equinor/eds-utils',
          '@storybook/addon-docs/mdx-react-shim',
          '@storybook/blocks',
        ],
      },
    }
  },

  docs: {
    autodocs: true,
  },
}

export default config
