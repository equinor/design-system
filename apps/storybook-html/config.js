import { configure, addParameters } from '@storybook/html'

function loadStories() {
  const req = require.context('./stories', true, /\.stories\.js$/)
  req.keys().forEach((filename) => req(filename))
}

addParameters({
  options: {
    showPanel: false,
  },
})

configure(loadStories, module)
