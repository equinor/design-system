module.exports = {
  typescript: {
    // reactDocgen: 'react-docgen',
    // checkOptions: {
    //   compilerOptions: {
    //     typeRoots: ['../stories/typings', 'node_modules/@types'],
    //   },
    // },
  },
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
}
