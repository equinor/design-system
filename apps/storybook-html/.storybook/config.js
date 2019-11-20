import { configure, addParameters, addDecorator } from '@storybook/html'
import { withA11y } from '@storybook/addon-a11y'
import { theme } from './eds-theme'

addParameters({
  options: {
    showPanel: true,
    panelPosition: 'bottom',
    showSearchBox: false,
    theme,
  },
})

addDecorator(withA11y)

configure(require.context('../stories', true, /\.stories\.js$/), module)
