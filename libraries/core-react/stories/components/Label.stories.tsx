import React from 'react'
import styled from 'styled-components'
import { Label, LabelProps } from '@components'
import { Story, Meta } from '@storybook/react/types-6-0'

export default {
  title: 'Components/Label',
  component: Label,
  parameters: {
    docs: {
      description: {
        component: `The **Label** component is intended to use if you need to more flexibility than the wrapped <code>TextField</code> or
        select components give.<br/>
        ♿  Note on accessibility:<br/>
        It's important to link the <code>Label</code> to the corresponding input element. Use the React version of the html for attribute <code>htmlFor</code>
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

export const Accessible: Story<LabelProps> = () => {
  // To wrap the input component is not yet supported
  return (
    <>
      <Label label="I use the htmlFor prop" htmlFor="speed" />
      <input type="text" id="speed" />
    </>
  )
}
