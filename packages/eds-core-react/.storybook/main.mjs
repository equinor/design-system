const config = {
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },

  stories: [
    '../src/**/*.@(mdx|stories.@(ts|tsx))',
    '../stories/**/*.@(mdx|stories.@(ts|tsx))',
  ],

  addons: ['@storybook/addon-a11y', '@storybook/addon-links', {
    name: '@storybook/addon-docs',
    options: {},
  }],

  features: {
    interactionsDebugger: true,
    storyStoreV7: true,
    actions: false
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
          '@storybook/addon-docs/blocks',
        ],
      },
    }
  }
}

export default config
