import { createElement } from 'react'
import './preview.css'
import '../src/components/next/index.css'

const preview = {
  viewMode: 'docs',

  initialGlobals: {
    colorScheme: 'light',
  },

  decorators: [
    (Story, context) => {
      const isNext = context.title.startsWith('EDS 2.0')
      if (!isNext) return createElement(Story)

      const colorScheme = context.globals.colorScheme || 'light'

      return createElement(
        'div',
        {
          'data-color-scheme': colorScheme,
          className: 'eds-storybook-wrapper',
        },
        createElement(Story),
      )
    },
  ],

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
