import remarkGfm from 'remark-gfm'

const config = {
  stories: [
    '../stories/docs/*.stories.@(ts|tsx|mdx)',
    '../src/**/*.stories.@(ts|tsx|mdx)',
    '../stories/**/*.stories.@(ts|tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    '@storybook/addon-actions',
    '@storybook/addon-essentials',
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
  core: {
    builder: '@storybook/builder-vite',
  },
  framework: {
    name: '@storybook/react-vite',
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
