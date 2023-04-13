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
    buildStoriesJson: true, //needed for zeroheight integration, to be replaced with 'storyStoreV7: true' after upgrade to storybook v7 https://learninghub.zeroheight.com/hc/en-us/articles/11847325839259
  },
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
}
