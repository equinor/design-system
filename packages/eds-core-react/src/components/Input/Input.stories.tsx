import { useState, useEffect } from 'react'
import { StoryFn, Meta } from '@storybook/react'
import { anchor, done } from '@equinor/eds-icons'
import { Input, InputProps, Label, EdsProvider, Density } from '../..'
import styled from 'styled-components'
import { Stack } from './../../../.storybook/components'
import page from './Input.docs.mdx'
import { Button } from '../Button'
import { Icon } from '../Icon'

const icons = {
  done,
}

Icon.add(icons)

const meta: Meta<typeof Input> = {
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
}

export default meta

export const Introduction: StoryFn<InputProps> = (args) => {
  return <Input {...args} />
}

export const Types: StoryFn<InputProps> = () => (
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

export const Variants: StoryFn<InputProps> = () => (
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

export const Disabled: StoryFn<InputProps> = () => (
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

export const ReadOnly: StoryFn<InputProps> = () => (
  <>
    <Label htmlFor="textfield-readOnly" label="Read only" />
    <Input id="textfield-readOnly" placeholder="Placeholder text" readOnly />
  </>
)
ReadOnly.storyName = 'Read only'

export const Accessiblity: StoryFn<InputProps> = () => {
  // To wrap the input component inside the label element is not yet supported
  return (
    <>
      <Label htmlFor="a11yExample" label="I use the htmlFor prop" />
      <Input type="text" id="a11yExample" />
    </>
  )
}

export const Compact: StoryFn<InputProps> = () => {
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

export const WithIcons: StoryFn<InputProps> = () => {
  const [icon, setIcon] = useState(true)
  return (
    <>
      <div>
        <Button
          variant="outlined"
          onClick={() => setIcon(!icon)}
          style={{ marginBottom: '16px' }}
        >
          Toggle Icon
        </Button>
        <Input
          id="icons-text"
          type="date"
          defaultValue="Input text"
          label="Label text"
          meta="Meta"
          helperText="Helper Text"
          leftAdornments={icon && <Icon name="done" title="Done" />}
        />
        <Input
          id="icons-text"
          type="date"
          defaultValue="Input text"
          label="Label text"
          meta="Meta"
          helperText="Helper Text"
          rightAdornments={icon && <Icon name="done" title="Done" />}
        />
        <Input
          id="icons-text"
          type="date"
          defaultValue="Input text"
          label="Label text"
          meta="Meta"
          helperText="Helper Text"
          rightAdornments={icon && <Icon name="done" title="Done" />}
          leftAdornments={icon && <Icon name="done" title="Done" />}
        />
      </div>
    </>
  )
}

WithIcons.storyName = 'With icons'
WithIcons.decorators = [
  (Story) => {
    return (
      <Stack
        align="baseline"
        style={{
          display: 'grid',
          gridGap: '32px',
          gridTemplateColumns: 'repeat(3, auto)',
        }}
      >
        <Story />
      </Stack>
    )
  },
]

export const WithAdornments: StoryFn<InputProps> = () => {
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

export const Casted: StoryFn<InputProps> = (args) => {
  return <Input as="textarea" {...args} />
}

export const OverrideBackground: StoryFn<InputProps> = (args) => {
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
