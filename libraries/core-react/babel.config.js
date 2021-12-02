const installedBabelVersion = require('@babel/runtime/package.json').version

module.exports = function babelConfig(api) {
  api.cache(true)

  const presets = [
    '@babel/preset-typescript',
    ['@babel/preset-env'],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
  ]

  const exclude = ['node_modules/**']

  const plugins = [
    'babel-plugin-styled-components',
    [
      '@babel/plugin-transform-runtime',
      {
        version: installedBabelVersion,
      },
    ],
  ]

  const env = {
    test: {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        [
          '@babel/preset-react',
          {
            runtime: 'automatic',
          },
        ],
      ],
      plugins,
    },
  }

  return {
    exclude,
    presets,
    plugins,
    env,
  }
}
