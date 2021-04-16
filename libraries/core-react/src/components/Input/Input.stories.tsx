import React from 'react'
import styled from 'styled-components'
import { Input, InputProps, Label } from '@components'
import { Story, Meta } from '@storybook/react/types-6-0'

export default {
  title: 'Components/Input',
  component: Input,
  parameters: {
    docs: {
      description: {
        component: `The **Input** component is intended to use if you need to more flexibility than the wrapped <code>TextField</code> or
        select components give.  
        `,
      },
    },
  },
} as Meta

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(2, fit-content(100%));
`
export const Default: Story<InputProps> = (args) => <Input {...args} />

export const types: Story<InputProps> = () => (
  <Wrapper>
    <div>
      <Label htmlFor="textfield-normal" label="Normal" />
      <Input
        id="textfield-normal"
        placeholder="Placeholder text"
        autoComplete="off"
      />
    </div>
    <div>
      <Label htmlFor="textfield-number" label="Number" />
      <Input
        type="number"
        id="textfield-number"
        placeholder="Placeholder text"
      />
    </div>
    <div>
      <Label htmlFor="textfield-search" label="Search" />
      <Input
        type="search"
        id="textfield-search"
        placeholder="Placeholder text"
      />
    </div>
    <div>
      <Label htmlFor="textfield-password" label="Password" />
      <Input
        type="password"
        id="textfield-password"
        placeholder="Placeholder text"
      />
    </div>
    <div>
      <Label htmlFor="textfield-email" label="Email" />
      <Input type="email" id="textfield-email" placeholder="Placeholder text" />
    </div>
  </Wrapper>
)

export const Accessiblity: Story<InputProps> = () => {
  // To wrap the input component inside the label element is not yet supported
  return (
    <>
      <Label htmlFor="a11yExample" label="I use the htmlFor prop" />
      <Input type="text" id="a11yExample" />
    </>
  )
}

Accessiblity.parameters = {
  docs: {
    storyDescription: `It's important to link the <code>Input</code> to the corresponding label. `,
  },
}
