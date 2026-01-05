import { useState } from 'react'
import { StoryFn, Meta } from '@storybook/react-vite'
import { anchor, done } from '@equinor/eds-icons'
import { Input } from './Input'
import type { InputProps } from './Input.types'
import { Label } from '../Label'
import { Field } from '../Field'
import { Stack } from './../../../../.storybook/components'
import { Icon } from '../../Icon'
import { Button } from '../../Button'
import page from './Input.docs.mdx'

const icons = {
  done,
}

Icon.add(icons)

const meta: Meta<typeof Input> = {
  title: 'EDS 2.0 (beta)/Input',
  component: Input,
  tags: ['beta'],
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
    <Input
      aria-label="Text input"
      placeholder="Text (default)"
      autoComplete="off"
    />
    <Input aria-label="Number input" type="number" placeholder="Number" />
    <Input aria-label="Password input" type="password" placeholder="Password" />
  </>
)

export const ValidationStates: StoryFn<InputProps> = () => (
  <>
    <Input
      aria-label="Default input"
      placeholder="Default"
      autoComplete="off"
    />
    <Input
      aria-label="Invalid input"
      placeholder="Invalid"
      autoComplete="off"
      invalid
    />
  </>
)

export const Disabled: StoryFn<InputProps> = () => (
  <>
    <Input
      aria-label="Disabled with value"
      defaultValue="Disabled value"
      disabled
    />
    <Input
      aria-label="Disabled with placeholder"
      placeholder="Disabled placeholder"
      disabled
    />
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
    <Input
      aria-label="Read only with value"
      defaultValue="Read only value"
      readOnly
    />
    <Input
      aria-label="Read only with placeholder"
      placeholder="Read only placeholder"
      readOnly
    />
  </>
)
ReadOnly.storyName = 'Read only'

export const WithLabel: StoryFn<InputProps> = () => {
  return (
    <>
      {/* Recommended: Use Field component */}
      <Field>
        <Label htmlFor="field-example" label="Using Field (recommended)" />
        <Input id="field-example" placeholder="Field handles spacing" />
      </Field>

      {/* Alternative: Manual layout with CSS gap */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--eds-selectable-space-vertical)',
        }}
      >
        <Label htmlFor="manual-example" label="Manual spacing with CSS gap" />
        <Input id="manual-example" placeholder="Custom layout" />
      </div>
    </>
  )
}
WithLabel.storyName = 'With Label'

export const Compact: StoryFn<InputProps> = () => (
  <>
    <div data-density="spacious">
      <Input
        aria-label="Spacious density"
        placeholder="Spacious (default)"
        autoComplete="off"
      />
    </div>
    <div data-density="comfortable">
      <Input
        aria-label="Comfortable density"
        placeholder="Comfortable (compact)"
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
      <Input
        aria-label="Default with adornments"
        type="text"
        placeholder="Default"
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
            <span data-color-appearance="neutral">unit</span>
            <Icon data={anchor} size={18} />
          </>
        }
      />
      <Input
        aria-label="Invalid with adornments"
        type="text"
        defaultValue="Invalid value"
        invalid
        leftAdornments={
          <Button
            variant="ghost_icon"
            color="danger"
            style={{ height: '24px', width: '24px' }}
          >
            IT
          </Button>
        }
        rightAdornments={
          <>
            <span data-color-appearance="neutral">unit</span>
            <Icon data={anchor} size={18} />
          </>
        }
      />
      <Input
        aria-label="Disabled with adornments"
        type="text"
        disabled
        placeholder="Disabled"
        value="Some text"
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
            <span data-color-appearance="neutral">unit</span>
            <Icon data={anchor} size={18} />
          </>
        }
      />
      <Input
        aria-label="Read only with adornments"
        type="text"
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
            <span data-color-appearance="neutral">unit</span>
            <Icon data={anchor} size={18} />
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
        style={{
          padding: '24px',
          background: 'var(--eds-color-bg-canvas)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <h3 style={{ margin: 0 }}>Light Mode</h3>
        <Input aria-label="Default" placeholder="Default" autoComplete="off" />
        <Input
          aria-label="With value"
          defaultValue="With value"
          autoComplete="off"
        />
        <Input
          aria-label="Invalid"
          defaultValue="Invalid"
          invalid
          autoComplete="off"
        />
        <Input aria-label="Read only" defaultValue="Read only" readOnly />
        <Input aria-label="Disabled" placeholder="Disabled" disabled />
      </div>

      {/* Dark mode */}
      <div
        data-color-scheme="dark"
        style={{
          padding: '24px',
          background: 'var(--eds-color-bg-canvas)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <h3 style={{ margin: 0, color: 'var(--eds-color-text-strong)' }}>
          Dark Mode
        </h3>
        <Input aria-label="Default" placeholder="Default" autoComplete="off" />
        <Input
          aria-label="With value"
          defaultValue="With value"
          autoComplete="off"
        />
        <Input
          aria-label="Invalid"
          defaultValue="Invalid"
          invalid
          autoComplete="off"
        />
        <Input aria-label="Read only" defaultValue="Read only" readOnly />
        <Input aria-label="Disabled" placeholder="Disabled" disabled />
      </div>
    </div>
  )
}
ColorSchemes.storyName = 'Light & Dark Mode'
