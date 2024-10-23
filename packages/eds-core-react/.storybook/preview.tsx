import { DocsContainer } from '@storybook/blocks'
import * as React from 'react'
import '@equinor/eds-tokens/css/variables-verbose.css'
import { Preview } from '@storybook/react'

const DocsContainerWithWrapper = ({ children, context, ...props }) => {
  return (
    <div data-density={context.store.userGlobals.globals.density}>
      <DocsContainer context={context} {...props}>
        {children}
      </DocsContainer>
    </div>
  )
}

const preview: Preview = {
  /*   viewMode: 'docs',*/
  parameters: {
    docs: {
      container: DocsContainerWithWrapper,
    },
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
  globalTypes: {
    density: {
      description: 'Global density for components',
      defaultValue: 'spacious',
      toolbar: {
        title: 'Density',
        icon: 'accessibility',
        items: ['spacious', 'comfortable'],
        dynamicTitle: true,
      },
    },
  },
}
export default preview
