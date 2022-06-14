import { useState, useEffect } from 'react'
import { Input, InputProps, Label, EdsProvider, Density } from '../..'
import { Story } from '@storybook/react/types-6-0'
import { ComponentMeta } from '@storybook/react'
import { Stack } from './../../../.storybook/components'
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

export const Introduction: Story<InputProps> = (args) => <Input {...args} />

export const Types: Story<InputProps> = () => (
  <Stack>
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
  </Stack>
)

export const Variants: Story<InputProps> = () => (
  <Stack>
    <div>
      <Label htmlFor="textfield-default" label="Default" />
      <Input
        id="textfield-default"
        placeholder="Placeholder text"
        autoComplete="off"
      />
    </div>
    <div>
      <Label htmlFor="textfield-success" label="Success" />
      <Input
        id="textfield-success"
        placeholder="Placeholder text"
        autoComplete="off"
        variant="success"
      />
    </div>
    <div>
      <Label htmlFor="textfield-warning" label="Warning" />
      <Input
        id="textfield-warning"
        placeholder="Placeholder text"
        autoComplete="off"
        variant="warning"
      />
    </div>
    <div>
      <Label htmlFor="textfield-error" label="Error" />
      <Input
        id="textfield-error"
        placeholder="Placeholder text"
        autoComplete="off"
        variant="error"
      />
    </div>
  </Stack>
)

export const Disabled: Story<InputProps> = () => (
  <>
    <Label htmlFor="textfield-disabled" label="Disabled" />
    <Input id="textfield-disabled" placeholder="Placeholder text" disabled />
  </>
)

export const ReadOnly: Story<InputProps> = () => (
  <>
    <Label htmlFor="textfield-readOnly" label="Read only" />
    <Input id="textfield-readOnly" placeholder="Placeholder text" readOnly />
  </>
)
ReadOnly.storyName = 'Read only'

export const Accessiblity: Story<InputProps> = () => {
  // To wrap the input component inside the label element is not yet supported
  return (
    <>
      <Label htmlFor="a11yExample" label="I use the htmlFor prop" />
      <Input type="text" id="a11yExample" />
    </>
  )
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
