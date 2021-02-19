import { addDecorator } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import { GlobalStyle } from '@components'
import { themes } from '@storybook/theming'

addDecorator(withInfo)

export const decorators = [
  (Story) => (
    <>
      <GlobalStyle />
      <Story />
    </>
  ),
]

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  viewMode: 'docs',
  /* docs: {
    theme: themes.dark,
  }, */
  darkMode: {
    // Set the initial theme
    current: 'light',
    // Override the default dark theme
    dark: { ...themes.dark },
    // Override the default light theme
    light: { ...themes.normal },
    stylePreview: true,
  },
}
