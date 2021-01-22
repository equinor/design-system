const path = require('path')

module.exports = {
  stories: [
    '../stories/docs/*.stories.mdx',
    '../stories/components/**/*.stories.@(ts|tsx|mdx)',
    // '../stories/screens/**/*.@(ts|tsx|mdx)',
  ],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: async (config) => {
    config.resolve.alias['@components'] = path.resolve(__dirname, '../src')
    config.resolve.alias['@hooks'] = path.resolve(__dirname, '../src/hooks')
    config.resolve.alias['@utils'] = path.resolve(__dirname, '../src/utils')
    return config
  },
}
