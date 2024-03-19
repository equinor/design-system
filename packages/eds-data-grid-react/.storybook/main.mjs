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
      options: {},
    },
  ],
  features: {
    interactionsDebugger: true,
    storyStoreV7: true,
  },
  core: {},

  framework: {
    name: '@storybook/react-vite',
    options: {},
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
