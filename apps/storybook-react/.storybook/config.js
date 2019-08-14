import { configure, addDecorator } from '@storybook/react'
import '@equinor-internal/equinor-font'
import { withA11y } from '@storybook/addon-a11y'

function loadStories() {
  const req = require.context('../stories', true, /\.stories\.jsx$/)
  req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module)

addDecorator(withA11y)
