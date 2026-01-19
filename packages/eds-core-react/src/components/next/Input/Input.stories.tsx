import { StoryFn, Meta } from '@storybook/react-vite'
import { anchor, search } from '@equinor/eds-icons'
import { Input } from './Input'
import type { InputProps } from './Input.types'
import { Field } from '../Field'
import { Stack } from './../../../../.storybook/components'
import { Icon } from '../../Icon'
import { Button } from '../../Button'
import page from './Input.docs.mdx'

const meta: Meta<typeof Input> = {
  title: 'EDS 2.0 (beta)/Input',
  component: Input,
  tags: ['beta'],
  args: {
    disabled: false,
    invalid: false,
    readOnly: false,
    required: false,
  },
  parameters: {
    docs: {
      page,
      source: {
        excludeDecorators: true,
      },
    },
  },
  argTypes: {
    // Core props
    placeholder: {
      control: 'text',
      description: 'Placeholder text displayed when input is empty',
      table: {
        category: 'Core',
      },
    },
    type: {
      control: 'select',
      options: ['text', 'number', 'password', 'email', 'tel', 'url', 'date'],
      description: 'HTML input type attribute',
      table: {
        category: 'Core',
        defaultValue: { summary: 'text' },
      },
    },
    as: {
      control: 'radio',
      options: ['input', 'textarea'],
      description: 'Render as single-line input or multi-line textarea',
      table: {
        category: 'Core',
        defaultValue: { summary: 'input' },
      },
    },

    // States
    invalid: {
      control: 'boolean',
      description: 'Shows error styling with red border and adornment colors',
      table: {
        category: 'States',
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables input interaction',
      table: {
        category: 'States',
        defaultValue: { summary: 'false' },
      },
    },
    readOnly: {
      control: 'boolean',
      description: 'Makes input read-only (visible but not editable)',
      table: {
        category: 'States',
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: 'boolean',
      description:
        'Native HTML required attribute for form validation. Note: For visual indicator text like "(Required)", use Field.Label with the indicator prop.',
      table: {
        category: 'States',
        defaultValue: { summary: 'false' },
      },
    },

    // Adornments
    leftText: {
      control: 'text',
      description:
        'Text prefix on the left (e.g., "$", "https://"). Always neutral color.',
      table: {
        category: 'Adornments',
      },
    },
    rightText: {
      control: 'text',
      description:
        'Text suffix on the right (e.g., "kg", "%", "USD"). Always neutral color.',
      table: {
        category: 'Adornments',
      },
    },
    leftAdornment: {
      control: false,
      description:
        'ReactNode for left side (icons, buttons). Inherits state color (red when invalid).',
      table: {
        category: 'Adornments',
        type: { summary: 'ReactNode' },
      },
    },
    rightAdornment: {
      control: false,
      description:
        'ReactNode for right side (icons, buttons). Inherits state color (red when invalid).',
      table: {
        category: 'Adornments',
        type: { summary: 'ReactNode' },
      },
    },

    // Other
    className: {
      control: 'text',
      description: 'Additional CSS class names for the container',
      table: {
        category: 'Other',
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
  invalid: false,
  disabled: false,
  readOnly: false,
}

export const Types: StoryFn<InputProps> = () => (
  <>
    <Input
      aria-label="Text input"
      defaultValue="Hello world"
      autoComplete="off"
    />
    <Input aria-label="Number input" type="number" defaultValue="42" />
    <Input
      aria-label="Password input"
      type="password"
      defaultValue="secret123"
    />
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

export const States: StoryFn<InputProps> = () => (
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
States.storyName = 'Disabled & Read only'

export const WithLabel: StoryFn<InputProps> = () => {
  return (
    <>
      {/* Recommended: Use Field component */}
      <Field>
        <Field.Label htmlFor="field-example">
          Using Field (recommended)
        </Field.Label>
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
        <Field.Label htmlFor="manual-example">
          Manual spacing with CSS gap
        </Field.Label>
        <Input id="manual-example" placeholder="Custom layout" />
      </div>
    </>
  )
}
WithLabel.storyName = 'With Label'
WithLabel.parameters = {
  docs: {
    description: {
      story: `
For a complete form field with label, description, helper message, and required/optional indicators, use the **TextField** component instead. It handles all the composition and accessibility for you.

Input is a low-level building block for custom compositions.
      `,
    },
  },
}

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

export const WithAdornments: StoryFn<InputProps> = () => {
  return (
    <>
      <Input
        aria-label="With text prefix and suffix"
        type="number"
        placeholder="Amount"
        leftText="$"
        rightText="USD"
      />
      <Input
        aria-label="With icon"
        type="text"
        placeholder="With icon"
        rightAdornment={<Icon data={anchor} size={18} />}
      />
      <Input
        aria-label="With button"
        type="text"
        placeholder="Search"
        rightAdornment={
          <Button
            variant="ghost_icon"
            style={{ height: '24px', width: '24px' }}
          >
            <Icon data={search} size={18} />
          </Button>
        }
      />
      <Input
        aria-label="Invalid with icon"
        type="text"
        defaultValue="Invalid value"
        invalid
        rightAdornment={<Icon data={anchor} size={18} />}
      />
      <Input
        aria-label="Invalid with text and adornment"
        type="text"
        defaultValue="invalid-url"
        invalid
        leftText="https://"
        leftAdornment={<Icon data={anchor} size={18} />}
        rightText=".com"
      />
      <Input
        aria-label="Invalid with button"
        type="text"
        defaultValue="Invalid with button"
        invalid
        rightAdornment={
          <Button
            variant="ghost_icon"
            color="danger"
            style={{ height: '24px', width: '24px' }}
          >
            <Icon data={search} size={18} />
          </Button>
        }
      />
      <Input
        aria-label="Disabled with adornments"
        type="text"
        disabled
        value="Disabled"
        leftText="$"
        rightAdornment={<Icon data={anchor} size={18} />}
      />
    </>
  )
}

export const DensityWithAdornments: StoryFn<InputProps> = () => {
  return (
    <div
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}
    >
      {/* Spacious density */}
      <div
        data-density="spacious"
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        <h3 style={{ margin: 0 }}>Spacious (default)</h3>
        <Input
          aria-label="Default spacious"
          placeholder="Default"
          leftText="https://"
          leftAdornment={<Icon data={anchor} size={18} />}
          rightText=".com"
          rightAdornment={<Icon data={search} size={18} />}
        />
        <Input
          aria-label="Invalid spacious"
          defaultValue="invalid-url"
          invalid
          leftText="https://"
          leftAdornment={<Icon data={anchor} size={18} />}
          rightText=".com"
          rightAdornment={<Icon data={search} size={18} />}
        />
        <Input
          aria-label="Disabled spacious"
          value="disabled-url"
          disabled
          leftText="https://"
          leftAdornment={<Icon data={anchor} size={18} />}
          rightText=".com"
          rightAdornment={<Icon data={search} size={18} />}
        />
      </div>

      {/* Comfortable density */}
      <div
        data-density="comfortable"
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        <h3 style={{ margin: 0 }}>Comfortable (compact)</h3>
        <Input
          aria-label="Default comfortable"
          placeholder="Default"
          leftText="https://"
          leftAdornment={<Icon data={anchor} size={18} />}
          rightText=".com"
          rightAdornment={<Icon data={search} size={18} />}
        />
        <Input
          aria-label="Invalid comfortable"
          defaultValue="invalid-url"
          invalid
          leftText="https://"
          leftAdornment={<Icon data={anchor} size={18} />}
          rightText=".com"
          rightAdornment={<Icon data={search} size={18} />}
        />
        <Input
          aria-label="Disabled comfortable"
          value="disabled-url"
          disabled
          leftText="https://"
          leftAdornment={<Icon data={anchor} size={18} />}
          rightText=".com"
          rightAdornment={<Icon data={search} size={18} />}
        />
      </div>
    </div>
  )
}
DensityWithAdornments.storyName = 'Density with Adornments'

export const Casted: StoryFn<InputProps> = (args) => {
  return <Input as="textarea" {...args} />
}

export const OverrideBackground: StoryFn<InputProps> = (args) => {
  return (
    <div
      style={
        {
          '--eds-color-neutral-1': '#fff',
          padding: '24px',
          background: '#f7f7f7',
        } as React.CSSProperties
      }
    >
      <Input {...args} placeholder="Custom background" />
    </div>
  )
}

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
