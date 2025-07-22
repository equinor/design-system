const config = {
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },

  stories: ['../src/**/*.@(mdx|stories.@(ts|tsx))'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-links', '@storybook/addon-docs'],

  /*   features: {
    interactionsDebugger: true,
    storyStoreV7: true,
  }, */
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
        dedupe: [
          'styled-components',
          'react',
          'react-dom',
          '@equinor/eds-core-react',
          '@tanstack/react-virtual',
        ],
      },
      optimizeDeps: {
        ...config.optimizeDeps,
        include: [
          ...(config.optimizeDeps?.include ?? []),
          '@mdx-js/react',
          'react/jsx-dev-runtime',
          '@storybook/addon-docs/blocks',
        ],
      },
    }
  }
}

export default config
