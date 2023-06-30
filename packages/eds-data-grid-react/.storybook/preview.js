const preview = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  viewMode: 'docs',
  parameters: {
    options: {
      storySort: {
        method: '',
        order: [
          'Introduction',
          'Data Display',
          'Feedback',
          'Inputs',
          'Navigation',
          'Surfaces',
          'Typography',
          'Icons',
          ['Introduction', 'Preview', 'Icon'],
          '*',
          'Playground',
        ],
      },
    },
  },
}
export default preview
