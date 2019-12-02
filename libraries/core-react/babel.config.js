module.exports = function(api) {
  api.cache(true)

  const presets = ['@babel/preset-env', '@babel/preset-react']

  const plugins = [
    'babel-plugin-styled-components',
    '@babel/plugin-proposal-class-properties',
  ]

  const env = {
    test: {
      presets: ['@babel/preset-env', '@babel/preset-react'],
      plugins,
    },
  }

  return {
    presets,
    plugins,
    env,
  }
}
