import { addDecorator } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import { GlobalStyleDark } from '../stories/testing/GlobalStyles'

addDecorator(withInfo)

export const decorators = [
  (Story) => (
    <>
      <GlobalStyleDark />
      <Story />
    </>
  ),
]

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  viewMode: 'docs',
}
