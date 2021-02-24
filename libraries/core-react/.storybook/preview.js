import { addDecorator } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import { GlobalStyle } from '../stories/testing/GlobalStyles'

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
}
