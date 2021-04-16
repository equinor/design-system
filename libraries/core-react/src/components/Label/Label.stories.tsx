import React from 'react'
import { Label, LabelProps, Input } from '../..'
import { Story, Meta } from '@storybook/react/types-6-0'

export default {
  title: 'Components/Label',
  component: Label,
  parameters: {
    docs: {
      description: {
        component: `The **Label** component is intended to use if you need to more flexibility than the wrapped <code>TextField</code> or
        select components give.<br/>
        `,
      },
    },
  },
} as Meta

export const Default: Story<LabelProps> = (args) => (
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
    storyDescription: `It's important to link the <code>Label</code> to the corresponding input element. Use the React version of the html for attribute <code>htmlFor</code>
    as <code>Label</code> does not support to wrap the input field.
    `,
  },
}
