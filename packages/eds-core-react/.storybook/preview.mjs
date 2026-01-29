import './preview.css'
import '../src/components/next/index.css'

const preview = {
  viewMode: 'docs',

  parameters: {
    options: {
      storySort: {
        method: 'alphabetical',
        order: [
          'Introduction',
          'EdsProvider',
          'EDS 2.0 (beta)',
          ['About', 'Icon', 'Inputs'],
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
