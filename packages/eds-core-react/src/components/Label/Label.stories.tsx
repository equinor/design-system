import { Label, LabelProps, Input } from '../..'
import { Story } from '@storybook/react/types-6-0'
import { ComponentMeta } from '@storybook/react'
import page from './Label.docs.mdx'

export default {
  title: 'Inputs/Label',
  component: Label,
  parameters: {
    docs: {
      page,
    },
  },
} as ComponentMeta<typeof Label>

export const Introduction: Story<LabelProps> = (args) => (
  <Label label="I'm a label, play with me!" {...args} />
)

export const WithMeta: Story<LabelProps> = () => (
  <Label label="Speed" meta="km/h" />
)

WithMeta.storyName = 'With meta text'

export const Disabled: Story<LabelProps> = () => (
  <Label
    label="I'm disabled, that means I belong to a disabled input field"
    disabled
  />
)

export const Accessiblity: Story<LabelProps> = () => {
  // To wrap the input component inside the label element is not yet supported
  return (
    <>
      <Label label="I use the htmlFor prop" htmlFor="speed" />
      <Input type="text" id="speed" />
    </>
  )
}
Accessiblity.parameters = {
  docs: {
    storyDescription: `It's important to link the Label to the corresponding input element. Use the React version of the html for attribute htmlFor
    as Label does not support to wrap the input field.
    `,
  },
}
