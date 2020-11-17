const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

module.exports = {
  // typescript: {
  //   reactDocgen: 'react-docgen',
  // },
  stories: [
    '../docs/**/*.story.mdx',
    '../stories/**/*.stor(y|ies).(jsx|mdx|tsx)',
  ],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-storysource',
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
    config.plugins.push(new BundleAnalyzerPlugin())
    config.resolve.alias.push({
      'styled-components': path.resolve('./node_modules', 'styled-components'),
    })
    config.module.rules.push({
      test: /\.stories\.tsx?$/,
      loaders: [require.resolve('@storybook/source-loader')],
      enforce: 'pre',
    })
  },
}
