import { createElement, useEffect } from 'react'
import './preview.css'
import '../src/components/next/index.css'

const preview = {
  viewMode: 'docs',

  globalTypes: {
    colorScheme: {
      description: 'Color scheme for components',
      toolbar: {
        title: 'Color Scheme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
    debugGrid: {
      description: 'Show layout debug grid',
      toolbar: {
        title: 'Debug Grid',
        icon: 'ruler',
        items: [
          { value: 'off', title: 'Off' },
          { value: 'on', title: 'On' },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {
    colorScheme: 'light',
    debugGrid: 'off',
  },

  decorators: [
    (Story, context) => {
      const isNext = context.title.startsWith('EDS 2.0')
      const debugGrid = context.globals.debugGrid === 'on'

      useEffect(() => {
        document.body.classList.toggle('eds-debug-grid', debugGrid)
        return () => document.body.classList.remove('eds-debug-grid')
      }, [debugGrid])

      const colorScheme = context.globals.colorScheme || 'light'

      useEffect(() => {
        // The Tokens Studio beta semantic tokens are declared at :root and
        // reference step aliases that only exist under [data-color-scheme].
        // Custom properties substitute where they are declared, so the
        // attribute must sit on <html> for the semantic layer to resolve —
        // the subtree wrapper below is not enough.
        if (!isNext) return
        document.documentElement.setAttribute('data-color-scheme', colorScheme)
        return () =>
          document.documentElement.removeAttribute('data-color-scheme')
      }, [isNext, colorScheme])

      if (!isNext) return createElement(Story)

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
          'Mobile',
          ['About', 'Components'],
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
