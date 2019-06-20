import { configure } from '@storybook/react'
import '@equinor-internal/equinor-font'

function loadStories() {
  const req = require.context('../stories', true, /\.stories\.jsx$/)
  req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module)
