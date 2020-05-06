import React from 'react'
import { addParameters, addDecorator } from '@storybook/react'
import { withA11y } from '@storybook/addon-a11y'
import { createGlobalStyle } from 'styled-components'
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks'

const GlobalStyle = createGlobalStyle`
  body {
    font-family: Equinor, sans-serif;
  }
`

addParameters({
  docs: {
    container: DocsContainer,
    page: DocsPage,
  },
  options: {
    storySort: (a, b) =>
      a[1].kind === b[1].kind
        ? 0
        : a[1].id.localeCompare(b[1].id, undefined, { numeric: true }),
  },
})

addDecorator(withA11y)

addDecorator((story) => (
  <>
    <GlobalStyle />
    {story()}
  </>
))
