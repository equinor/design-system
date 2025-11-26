import { useState } from 'react'
import { StoryFn, Meta } from '@storybook/react-vite'
import { anchor, done } from '@equinor/eds-icons'
import { Input } from './Input'
import type { InputProps } from './Input.types'
import { Label } from '../../Label'
import { Stack } from './../../../../.storybook/components'
import { Icon } from '../../Icon'
import { Button } from '../../Button'
import page from './Input.docs.mdx'

const icons = {
  done,
}

Icon.add(icons)

const meta: Meta<typeof Input> = {
  title: 'Next (EDS 2.0)/Input',
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

Introduction.args = {
  placeholder: 'Placeholder text',
}

export const Types: StoryFn<InputProps> = () => (
  <>
    <div>
      <Label htmlFor="input-next-text" label="Text" />
      <Input id="input-next-text" autoComplete="off" />
    </div>
    <div>
      <Label htmlFor="input-next-number" label="Number" />
      <Input type="number" id="input-next-number" />
    </div>
    <div>
      <Label htmlFor="input-next-password" label="Password" />
      <Input type="password" id="input-next-password" />
    </div>
  </>
)

export const ValidationStates: StoryFn<InputProps> = () => (
  <>
    <div>
      <Label htmlFor="input-next-default" label="Default" />
      <Input
        id="input-next-default"
        placeholder="Placeholder text"
        autoComplete="off"
      />
    </div>
    <div>
      <Label htmlFor="input-next-invalid" label="Invalid" />
      <Input
        id="input-next-invalid"
        placeholder="Placeholder text"
        autoComplete="off"
        invalid
      />
    </div>
  </>
)
ValidationStates.storyName = 'Validation States'

export const Disabled: StoryFn<InputProps> = () => (
  <>
    <div>
      <Label htmlFor="input-next-disabled" label="Disabled with value" />
      <Input
        id="input-next-disabled"
        defaultValue="Disabled value"
        disabled
      />
    </div>
    <div>
      <Label
        htmlFor="input-next-disabled-placeholder"
        label="Disabled with placeholder"
      />
      <Input
        id="input-next-disabled-placeholder"
        placeholder="Placeholder text"
        disabled
      />
    </div>
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
    <div>
      <Label htmlFor="input-next-readonly" label="Read only with value" />
      <Input id="input-next-readonly" defaultValue="Read only value" readOnly />
    </div>
    <div>
      <Label
        htmlFor="input-next-readonly-placeholder"
        label="Read only with placeholder"
      />
      <Input
        id="input-next-readonly-placeholder"
        placeholder="Placeholder text"
        readOnly
      />
    </div>
  </>
)
ReadOnly.storyName = 'Read only'

export const Accessibility: StoryFn<InputProps> = () => {
  return (
    <>
      <Label htmlFor="input-next-a11y" label="I use the htmlFor prop" />
      <Input type="text" id="input-next-a11y" />
    </>
  )
}

export const Compact: StoryFn<InputProps> = () => (
  <>
    <div data-density="spacious">
      <Label htmlFor="input-next-spacious" label="Spacious (default)" />
      <Input
        id="input-next-spacious"
        placeholder="Spacious density"
        autoComplete="off"
      />
    </div>
    <div data-density="comfortable">
      <Label htmlFor="input-next-comfortable" label="Comfortable (compact)" />
      <Input
        id="input-next-comfortable"
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
        <Input
          id="input-next-icons-1"
          type="date"
          defaultValue="Input text"
          leftAdornments={icon && <Icon name="done" title="Done" />}
        />
        <Input
          id="input-next-icons-2"
          type="date"
          defaultValue="Input text"
          rightAdornments={icon && <Icon name="done" title="Done" />}
        />
        <Input
          id="input-next-icons-3"
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
      <Label htmlFor="input-next-adornments-default" label="Default" />
      <Input
        type="text"
        id="input-next-adornments-default"
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
      <Label htmlFor="input-next-adornments-invalid" label="Invalid" />
      <Input
        type="text"
        id="input-next-adornments-invalid"
        defaultValue="Invalid value"
        invalid
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
      <Label htmlFor="input-next-adornments-disabled" label="Disabled" />
      <Input
        type="text"
        id="input-next-adornments-disabled"
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
      <Label htmlFor="input-next-adornments-readonly" label="Readonly" />
      <Input
        type="text"
        id="input-next-adornments-readonly"
        defaultValue="Read only value"
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
  return <Input as="textarea" {...args} />
}

export const OverrideBackground: StoryFn<InputProps> = (args) => {
  return (
    <Input
      style={{ '--eds-color-bg-canvas': '#fff' } as React.CSSProperties}
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

export const ColorSchemes: StoryFn<InputProps> = () => {
  return (
    <div
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}
    >
      {/* Light mode */}
      <div
        data-color-scheme="light"
        style={{ padding: '24px', background: 'var(--eds-color-bg-canvas)' }}
      >
        <h3 style={{ marginTop: 0 }}>Light Mode</h3>
        <div>
          <Label htmlFor="input-light-default" label="Default" />
          <Input
            id="input-light-default"
            placeholder="Placeholder text"
            autoComplete="off"
          />
        </div>
        <div style={{ marginTop: '16px' }}>
          <Label htmlFor="input-light-filled" label="With value" />
          <Input
            id="input-light-filled"
            defaultValue="Input value"
            autoComplete="off"
          />
        </div>
        <div style={{ marginTop: '16px' }}>
          <Label htmlFor="input-light-invalid" label="Invalid" />
          <Input
            id="input-light-invalid"
            defaultValue="Invalid value"
            invalid
            autoComplete="off"
          />
        </div>
        <div style={{ marginTop: '16px' }}>
          <Label htmlFor="input-light-readonly" label="Read only" />
          <Input
            id="input-light-readonly"
            defaultValue="Read only value"
            readOnly
          />
        </div>
        <div style={{ marginTop: '16px' }}>
          <Label htmlFor="input-light-disabled" label="Disabled" />
          <Input
            id="input-light-disabled"
            placeholder="Placeholder text"
            disabled
          />
        </div>
      </div>

      {/* Dark mode */}
      <div
        data-color-scheme="dark"
        style={{ padding: '24px', background: 'var(--eds-color-bg-canvas)' }}
      >
        <h3 style={{ marginTop: 0, color: 'var(--eds-color-text-strong)' }}>
          Dark Mode
        </h3>
        <div>
          <Label htmlFor="input-dark-default" label="Default" />
          <Input
            id="input-dark-default"
            placeholder="Placeholder text"
            autoComplete="off"
          />
        </div>
        <div style={{ marginTop: '16px' }}>
          <Label htmlFor="input-dark-filled" label="With value" />
          <Input
            id="input-dark-filled"
            defaultValue="Input value"
            autoComplete="off"
          />
        </div>
        <div style={{ marginTop: '16px' }}>
          <Label htmlFor="input-dark-invalid" label="Invalid" />
          <Input
            id="input-dark-invalid"
            defaultValue="Invalid value"
            invalid
            autoComplete="off"
          />
        </div>
        <div style={{ marginTop: '16px' }}>
          <Label htmlFor="input-dark-readonly" label="Read only" />
          <Input
            id="input-dark-readonly"
            defaultValue="Read only value"
            readOnly
          />
        </div>
        <div style={{ marginTop: '16px' }}>
          <Label htmlFor="input-dark-disabled" label="Disabled" />
          <Input
            id="input-dark-disabled"
            placeholder="Placeholder text"
            disabled
          />
        </div>
      </div>
    </div>
  )
}
ColorSchemes.storyName = 'Light & Dark Mode'
