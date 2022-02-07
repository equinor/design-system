const path = require('path')

module.exports = {
  stories: [
    '../stories/docs/*.stories.@(ts|tsx|mdx)',
    '../src/**/*.stories.@(ts|tsx|mdx)',
    '../stories/**/*.stories.@(ts|tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
  ],
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
}
