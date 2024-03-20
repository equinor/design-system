const config = {
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  stories: ['../src/**/*.@(mdx|stories.@(ts|tsx))'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    '@storybook/addon-actions',
    '@storybook/addon-docs',
    {
      name: '@storybook/addon-essentials',
      options: {
        docs: false,
        actions: false,
      },
    },
  ],
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
        dedupe: ['styled-components', 'react', 'react-dom'],
      },
      optimizeDeps: {
        ...config.optimizeDeps,
        include: [
          ...(config.optimizeDeps?.include ?? []),
          '@mdx-js/react',
          'react/jsx-dev-runtime',
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
