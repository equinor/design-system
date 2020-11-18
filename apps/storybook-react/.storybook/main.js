const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

module.exports = {
  stories: ['../docs/**/*.story.mdx', '../stories/**/*.stories.@(jsx|mdx|tsx)'],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
      },
    },
  ],
  webpackFinal: async (config, { configType }) => {
    config.resolve.alias['styled-components'] = path.resolve(
      './node_modules',
      'styled-components',
    )

    // configType === 'PRODUCTION'
    // ? config.plugins.push(
    // new BundleAnalyzerPlugin({
    // generateStatsFile: true,
    // analyzerMode: disabled,
    // }),
    // )
    // : null

    return config
  },
}
