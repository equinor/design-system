import { useState } from 'react'
import { StoryFn, Meta } from '@storybook/react-vite'
import { anchor, done } from '@equinor/eds-icons'
import { Input as InputNew } from './Input.new'
import type { InputProps } from './Input.new.types'
import { Label } from '../..'
import { Stack } from './../../../.storybook/components'
import { Icon } from '../Icon'
import { Button } from '../Button'
import page from './Input.new.docs.mdx'

const icons = {
  done,
}

Icon.add(icons)

const meta: Meta<typeof InputNew> = {
  title: 'Inputs/Input (EDS 2.0)',
  component: InputNew,
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
  return <InputNew {...args} />
}

Introduction.args = {
  placeholder: 'Placeholder text',
}

export const Types: StoryFn<InputProps> = () => (
  <>
    <div>
      <Label htmlFor="input-new-text" label="Text" />
      <InputNew id="input-new-text" autoComplete="off" />
    </div>
    <div>
      <Label htmlFor="input-new-number" label="Number" />
      <InputNew type="number" id="input-new-number" />
    </div>
    <div>
      <Label htmlFor="input-new-password" label="Password" />
      <InputNew type="password" id="input-new-password" />
    </div>
  </>
)

export const Variants: StoryFn<InputProps> = () => (
  <>
    <div>
      <Label htmlFor="input-new-default" label="Default" />
      <InputNew
        id="input-new-default"
        placeholder="Placeholder text"
        autoComplete="off"
      />
    </div>
    <div>
      <Label htmlFor="input-new-success" label="Success" />
      <InputNew
        id="input-new-success"
        placeholder="Placeholder text"
        autoComplete="off"
        variant="success"
      />
    </div>
    <div>
      <Label htmlFor="input-new-warning" label="Warning" />
      <InputNew
        id="input-new-warning"
        placeholder="Placeholder text"
        autoComplete="off"
        variant="warning"
      />
    </div>
    <div>
      <Label htmlFor="input-new-error" label="Error" />
      <InputNew
        id="input-new-error"
        placeholder="Placeholder text"
        autoComplete="off"
        variant="error"
      />
    </div>
  </>
)

export const Disabled: StoryFn<InputProps> = () => (
  <>
    <Label htmlFor="input-new-disabled" label="Disabled" />
    <InputNew id="input-new-disabled" placeholder="Placeholder text" disabled />
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
    <Label htmlFor="input-new-readonly" label="Read only" />
    <InputNew id="input-new-readonly" placeholder="Placeholder text" readOnly />
  </>
)
ReadOnly.storyName = 'Read only'

export const Accessibility: StoryFn<InputProps> = () => {
  return (
    <>
      <Label htmlFor="input-new-a11y" label="I use the htmlFor prop" />
      <InputNew type="text" id="input-new-a11y" />
    </>
  )
}

export const Compact: StoryFn<InputProps> = () => (
  <>
    <div data-density="spacious">
      <Label htmlFor="input-new-spacious" label="Spacious (default)" />
      <InputNew
        id="input-new-spacious"
        placeholder="Spacious density"
        autoComplete="off"
      />
    </div>
    <div data-density="comfortable">
      <Label htmlFor="input-new-comfortable" label="Comfortable (compact)" />
      <InputNew
        id="input-new-comfortable"
        placeholder="Comfortable density"
        autoComplete="off"
      />
    </div>
  </>
)
Compact.storyName = 'Density'
Compact.decorators = [
  (Story) => {
    return (
      <Stack direction="column" align="start">
        <Story />
      </Stack>
    )
  },
]

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
        <InputNew
          id="input-new-icons-1"
          type="date"
          defaultValue="Input text"
          leftAdornments={icon && <Icon name="done" title="Done" />}
        />
        <InputNew
          id="input-new-icons-2"
          type="date"
          defaultValue="Input text"
          rightAdornments={icon && <Icon name="done" title="Done" />}
        />
        <InputNew
          id="input-new-icons-3"
          type="date"
          defaultValue="Input text"
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
    <>
      <Label htmlFor="input-new-adornments-default" label="Default" />
      <InputNew
        type="text"
        id="input-new-adornments-default"
        placeholder="Placeholder text Placeholder text"
        leftAdornments={
          <Button
            variant="ghost_icon"
            style={{ height: '24px', width: '24px' }}
          >
            IT
          </Button>
        }
        rightAdornments={
          <>
            unit
            <Icon data={anchor} size={18}></Icon>
          </>
        }
      />
      <Label htmlFor="input-new-adornments-error" label="Error" />
      <InputNew
        type="text"
        id="input-new-adornments-error"
        variant="error"
        leftAdornments={
          <Button
            variant="ghost_icon"
            style={{ height: '24px', width: '24px' }}
          >
            IT
          </Button>
        }
        rightAdornments={
          <>
            unit
            <Icon data={anchor} size={18}></Icon>
          </>
        }
      />
      <Label htmlFor="input-new-adornments-warning" label="Warning" />
      <InputNew
        type="text"
        id="input-new-adornments-warning"
        variant="warning"
        leftAdornments={
          <Button
            variant="ghost_icon"
            style={{ height: '24px', width: '24px' }}
          >
            IT
          </Button>
        }
        rightAdornments={
          <>
            unit
            <Icon data={anchor} size={18}></Icon>
          </>
        }
      />
      <Label htmlFor="input-new-adornments-success" label="Success" />
      <InputNew
        type="text"
        id="input-new-adornments-success"
        variant="success"
        leftAdornments={
          <Button
            variant="ghost_icon"
            style={{ height: '24px', width: '24px' }}
          >
            IT
          </Button>
        }
        rightAdornments={
          <>
            unit
            <Icon data={anchor} size={18}></Icon>
          </>
        }
      />
      <Label htmlFor="input-new-adornments-disabled" label="Disabled" />
      <InputNew
        type="text"
        id="input-new-adornments-disabled"
        disabled
        placeholder="Placeholder text Placeholder text"
        value="Some text Some textSome textSome text"
        leftAdornments={
          <Button
            disabled
            variant="ghost_icon"
            style={{ height: '24px', width: '24px' }}
          >
            IT
          </Button>
        }
        rightAdornments={
          <>
            unit
            <Icon data={anchor} size={18}></Icon>
          </>
        }
      />
      <Label htmlFor="input-new-adornments-readonly" label="Readonly" />
      <InputNew
        type="text"
        id="input-new-adornments-readonly"
        readOnly
        leftAdornments={
          <Button
            variant="ghost_icon"
            style={{ height: '24px', width: '24px' }}
          >
            IT
          </Button>
        }
        rightAdornments={
          <>
            unit
            <Icon data={anchor} size={18}></Icon>
          </>
        }
      />
    </>
  )
}

export const Casted: StoryFn<InputProps> = (args) => {
  return <InputNew as="textarea" {...args} />
}

export const OverrideBackground: StoryFn<InputProps> = (args) => {
  return (
    <InputNew
      style={{ '--eds-color-bg-input': '#fff' } as React.CSSProperties}
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
