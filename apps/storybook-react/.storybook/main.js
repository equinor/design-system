const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

module.exports = {
  stories: [
    '../docs/**/*.story.mdx',
    '../stories/**/*.stor(y|ies).(jsx|mdx|tsx)',
  ],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    // '@storybook/addon-storysource',
    '@storybook/addon-a11y',
    '@storybook/addon-knobs',
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
