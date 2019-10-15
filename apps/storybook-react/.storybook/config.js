import React from 'react'
import { configure, addDecorator, addParameters } from '@storybook/react'
// import { withKnobs } from '@storybook/addon-knobs'
import { withA11y } from '@storybook/addon-a11y'
import { createGlobalStyle } from 'styled-components'
import theme from './eds-theme'

const GlobalStyle = createGlobalStyle`
  body {
    font-family: Equinor, sans-serif;
  }
`

// TODO: Create theme based on tokens
addParameters({
  options: {
    showPanel: true,
    panelPosition: 'bottom',
    showSearchBox: false,
    theme,
  },
})

addDecorator(withA11y)
// addDecorator(withKnobs)

// TODO: Find out why we get duplicate styled components modules in dev
addDecorator((story) => (
  <>
    <GlobalStyle />
    {story()}
  </>
))

configure(require.context('../stories', true, /\.stories\.jsx$/), module)
