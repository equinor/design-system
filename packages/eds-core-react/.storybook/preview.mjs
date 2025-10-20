import './preview.css'

const preview = {
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

  tags: ['autodocs']
}
export default preview
