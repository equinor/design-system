import { useState, useEffect } from 'react'
import { Story, ComponentMeta } from '@storybook/react'
import { anchor } from '@equinor/eds-icons'
import { Input, InputProps, Label, EdsProvider, Density } from '../..'
import styled from 'styled-components'
import { Stack } from './../../../.storybook/components'
import page from './Input.docs.mdx'
import { Button } from '../Button'
import { Icon } from '../Icon'

export default {
  title: 'Inputs/Input',
  component: Input,
  parameters: {
    docs: {
      page,
      source: {
        excludeDecorators: true,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <Stack align="stretch" direction="column">
          <Story />
        </Stack>
      )
    },
  ],
} as ComponentMeta<typeof Input>

export const Introduction: Story<InputProps> = (args) => {
  return <Input {...args} />
}

export const Types: Story<InputProps> = () => (
  <>
    <div>
      <Label htmlFor="textfield-normal" label="Text" />
      <Input id="textfield-normal" autoComplete="off" />
    </div>
    <div>
      <Label htmlFor="textfield-number" label="Number" />
      <Input type="number" id="textfield-number" />
    </div>
    <div>
      <Label htmlFor="textfield-password" label="Password" />
      <Input type="password" id="textfield-password" />
    </div>
  </>
)

export const Variants: Story<InputProps> = () => (
  <>
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
  </>
)

export const Disabled: Story<InputProps> = () => (
  <>
    <Label htmlFor="textfield-disabled" label="Disabled" />
    <Input id="textfield-disabled" placeholder="Placeholder text" disabled />
  </>
)
Disabled.decorators = [
  (Story) => {
    return (
      <Stack direction="column" align="start">
        <Story />
      </Stack>
    )
  },
]

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
Compact.decorators = [
  (Story) => {
    return (
      <Stack direction="column" align="start">
        <Story />
      </Stack>
    )
  },
]

const SmallButton = styled(Button)`
  height: 24px;
  width: 24px;
`

export const WithAdornments: Story<InputProps> = () => {
  return (
    <EdsProvider>
      <Label htmlFor="adornments-default" label="Default" />
      <Input
        type="text"
        id="adornments-default"
        placeholder="Placeholder text Placeholder text"
        leftAdornments={<SmallButton variant="ghost_icon">IT</SmallButton>}
        rightAdornments={
          <>
            unit
            <Icon data={anchor} size={18}></Icon>
          </>
        }
      />
      <Label htmlFor="adornments-error" label="Error" />
      <Input
        type="text"
        id="adornments-error"
        variant="error"
        leftAdornments={<SmallButton variant="ghost_icon">IT</SmallButton>}
        rightAdornments={
          <>
            unit
            <Icon data={anchor} size={18}></Icon>
          </>
        }
      />
      <Label htmlFor="adornments-warning" label="Warning" />
      <Input
        type="text"
        id="adornments-warning"
        variant="warning"
        leftAdornments={<SmallButton variant="ghost_icon">IT</SmallButton>}
        rightAdornments={
          <>
            unit
            <Icon data={anchor} size={18}></Icon>
          </>
        }
      />
      <Label htmlFor="adornments-success" label="Success" />
      <Input
        type="text"
        id="adornments-success"
        variant="success"
        leftAdornments={<SmallButton variant="ghost_icon">IT</SmallButton>}
        rightAdornments={
          <>
            unit
            <Icon data={anchor} size={18}></Icon>
          </>
        }
      />
      <Label htmlFor="adornments-disabled" label="Disabled" />
      <Input
        type="text"
        id="adornments-disabled"
        disabled
        placeholder="Placeholder text Placeholder text"
        value="Some text Some textSome textSome text"
        leftAdornments={
          <SmallButton disabled variant="ghost_icon">
            IT
          </SmallButton>
        }
        rightAdornments={
          <>
            unit
            <Icon data={anchor} size={18}></Icon>
          </>
        }
      />
      <Label htmlFor="adornments-readonly" label="Readonly" />
      <Input
        type="text"
        id="adornments-readonly"
        readOnly
        leftAdornments={<SmallButton variant="ghost_icon">IT</SmallButton>}
        rightAdornments={
          <>
            unit
            <Icon data={anchor} size={18}></Icon>
          </>
        }
      />
    </EdsProvider>
  )
}

export const casted: Story<InputProps> = (args) => {
  return <Input as="textarea" {...args} />
}

export const OverrideBackground: Story<InputProps> = (args) => {
  return (
    <Input
      style={{ '--eds-input-background': '#fff' } as React.CSSProperties}
      {...args}
    />
  )
}
OverrideBackground.decorators = [
  (Story) => {
    return (
      <Stack style={{ background: '#f7f7f7', padding: '32px' }}>
        <Story />
      </Stack>
    )
  },
]
