module.exports = {
  stories: [
    '../src/**/*.stories.@(ts|tsx|mdx)',
    '../stories/**/*.stories.@(ts|tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
  ],
  features: {
    interactionsDebugger: true, // enable playback controls
  },
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
}
