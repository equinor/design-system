import remarkGfm from 'remark-gfm'

const config = {
  stories: ['../stories/docs/*.@(mdx|stories.@(ts|tsx))', '../src/**/*.@(mdx|stories.@(ts|tsx))', '../stories/**/*.@(mdx|stories.@(ts|tsx))'],
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
  core: {},
  framework: {
    name: '@storybook/react-vite',
    options: {}
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
  },
  docs: {
    autodocs: true,
  },
}

export default config
