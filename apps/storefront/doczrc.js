/* eslint import/no-default-export: off*/
export default {
  files: '**/*.mdx',
  typescript: true,
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
    },
    {
      title: 'Guidelines',
      route: '/guidelines/',
    },
    {
      title: 'Assets',
      route: '/assets/',
    },
    {
      title: 'Components',
      route: '/components/',
    },
    {
      title: 'Data visualisation',
      route: '/data-visualisation/',
    },
    {
      title: 'Patterns',
      route: '/patterns/',
    },
    {
      title: 'Updates',
      route: '/updates/',
    },
    {
      title: 'Help',
      route: '/help/',
    },
    {
      title: 'Contributing',
      route: '/contributing/',
    },
  ],
}
