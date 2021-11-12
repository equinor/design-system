module.exports = function babelConfig(api) {
  api.cache(true)

  const presets = ['@babel/preset-env', '@babel/preset-react']

  const exclude = ['node_modules/**']

  const plugins = [
    'babel-plugin-styled-components',
    '@babel/plugin-transform-runtime',
  ]

  const env = {
    test: {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-react',
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
