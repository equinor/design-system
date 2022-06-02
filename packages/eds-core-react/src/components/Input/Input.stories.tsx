import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Input, InputProps, Label, EdsProvider, Density } from '../..'
import { Story } from '@storybook/react/types-6-0'
import { ComponentMeta } from '@storybook/react'
import page from './Input.docs.mdx'

export default {
  title: 'Inputs/Input',
  component: Input,
  parameters: {
    docs: {
      page,
    },
  },
} as ComponentMeta<typeof Input>

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(2, fit-content(100%));
`
export const Introduction: Story<InputProps> = (args) => <Input {...args} />

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
    description: {
      story: "It's important to link the `Input` to the corresponding label.",
    },
  },
}

export const Compact: Story<InputProps> = () => {
  // To wrap the input component inside the label element is not yet supported
  const [density, setDensity] = useState<Density>('comfortable')

  useEffect(() => {
    // Simulate user change
    setDensity('compact')
  }, [density])

  return (
    <EdsProvider density={density}>
      <Label htmlFor="compact" label="Compact" />
      <Input type="text" id="compact" />
    </EdsProvider>
  )
}

Compact.parameters = {
  docs: {
    description: {
      story: 'Compact `Input` using `EdsProvider` ',
    },
  },
}
