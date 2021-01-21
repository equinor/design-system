const path = require('path')

module.exports = {
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
  stories: [
    '../docs/**/*.story.mdx',
    '../stories/**/*.stor(y|ies).@(jsx|mdx|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
      },
    },
    '@storybook/addon-essentials',
    '@storybook/addon-storysource',
    '@storybook/addon-a11y',
    'storybook-addon-designs',
  ],
  webpackFinal: async (config, { configType }) => {
    // production build in Docker, where “libraries” is copied into the storybook root

    const isProduction = configType === 'PRODUCTION'

    const pathToLibraries = isProduction ? '../libraries' : '../../../libraries'

    config.resolve.alias['styled-components'] = path.resolve(
      './node_modules',
      'styled-components',
    )

    config.resolve.alias['@hooks'] = path.resolve(
      __dirname,
      `${pathToLibraries}/${isProduction ? `eds-` : ''}core-react/src/hooks`,
    )
    config.resolve.alias['@utils'] = path.resolve(
      __dirname,
      `${pathToLibraries}/${isProduction ? `eds-` : ''}core-react/src/utils`,
    )

    isProduction
      ? (config.resolve.alias['@equinor'] = path.resolve(
          __dirname,
          pathToLibraries,
        ))
      : null

    return config
  },
}
