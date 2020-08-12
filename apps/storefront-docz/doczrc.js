/* eslint import/no-default-export: off*/
export default {
  files: '**/*.mdx',
  // will be prefixed in <title>
  themeConfig: {
    // “The initialColorMode flag no longer works, use initialColorModeName instead” it says on https://theme-ui.com/migrating/
    // Didn’t help, but keeping it here for now
    initialColorModeName: 'light',
    // Show errors above playground editor
    showLiveError: false,
    // Show preview of the code inside playground
    showLivePreview: true,
    // Show editor when a playground is rendered
    showPlaygroundEditor: false,
    // Show dark/light mode switch toggle in header
    showDarkModeSwitch: true,
    // Display edit this page button on every page
    showMarkdownEditButton: true,
    // Wrap the playground editor and preview in iframes to avoid style/script collisions
    useScopingInPlayground: false,
  },
  menu: [
    {
      title: 'Getting Started',
      route: '/getting-started/',
      children: [],
    },
    {
      title: 'Guidelines',
      route: '/guidelines/',
      children: [],
    },
    {
      title: 'Assets',
      route: '/assets/',
      children: [],
    },
    {
      title: 'Components',
      route: '/components/',
      children: [],
    },
    {
      title: 'Patterns',
      route: '/patterns/',
      children: [],
    },
    {
      title: 'Updates',
      route: '/updates/',
      children: [],
    },
    {
      title: 'Help',
      route: '/help/',
      children: [],
    },
    {
      title: 'Contributing',
      route: '/contributing/',
      children: [],
    },
  ],
}
