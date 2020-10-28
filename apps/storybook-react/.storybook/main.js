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
}
