import './preview.css'
import '../src/index.css'

const preview = {
  viewMode: 'docs',

  parameters: {
    options: {
      storySort: {
        method: '',
        order: [
          'Introduction',
          'EdsProvider',
          'EDS 2.0 (beta)',
          ['About', '*'],
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

  tags: ['autodocs'],
}
export default preview
