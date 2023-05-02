import remarkGfm from 'remark-gfm'

const path = require('path')

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
  framework: {
    // The name of the framework you want to use goes here
    name: '@storybook/react-webpack5',
    options: {},
  },
  webpackFinal: async (config) => {
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        'styled-components': path.resolve(
          __dirname,
          '../node_modules',
          'styled-components',
        ),
      },
    }
    return config
  },
  docs: {
    autodocs: true,
  },
}

export default config
