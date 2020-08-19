const path = require('path')

module.exports = async ({ config, mode }) => ({
  ...config,
  resolve: {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      'styled-components': path.resolve('./node_modules', 'styled-components'),
    },
  },
  module: {
    ...config.module,
    rules: [
      ...config.module.rules,
      {
        test: /\.stories\.jsx?$/,
        loaders: [require.resolve('@storybook/source-loader')],
        enforce: 'pre',
      },
    ],
  },
})
