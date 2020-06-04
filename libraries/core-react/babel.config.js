module.exports = function(api) {
  api.cache(true)

  const presets = ['@babel/preset-env', '@babel/preset-react']

  const plugins = ['babel-plugin-styled-components']

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
    presets,
    plugins,
    env,
  }
}
