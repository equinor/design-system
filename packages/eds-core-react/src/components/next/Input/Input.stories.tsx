import { StoryFn, Meta } from '@storybook/react-vite'
import { anchor, search, close } from '@equinor/eds-icons'
import { Input } from './Input'
import type { InputProps } from './Input.types'
import { Field } from '../Field'
import { ExampleLabel, Stack } from './../../../../.storybook/components'
import { Icon } from '../Icon'
import { Button } from '../Button'

const meta: Meta<typeof Input> = {
  title: 'EDS 2.0 (beta)/Inputs/Input',
  component: Input,
  tags: ['beta'],
  args: {
    disabled: false,
    invalid: false,
    readOnly: false,
    required: false,
    hideErrorIcon: false,
  },
  parameters: {
    docs: {
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
    // States
    invalid: {
      control: 'boolean',
      description: 'Shows error styling with red border',
      table: {
        category: 'States',
        defaultValue: { summary: 'false' },
      },
    },
    hideErrorIcon: {
      control: 'boolean',
      description:
        'Hide error icon when invalid. Only set to true when composing custom components like Search where the error icon is not applicable. For standard form inputs and TextField, keep this false (default).',
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
    startText: {
      control: 'text',
      description: 'Text at the start (e.g., "https://", "NOK")',
      table: {
        category: 'Adornments',
      },
    },
    endText: {
      control: 'text',
      description: 'Text at the end (e.g., "kg", "%", "NOK")',
      table: {
        category: 'Adornments',
      },
    },
    startAdornment: {
      control: false,
      description: 'ReactNode at the start (icons, buttons, etc.)',
      table: {
        category: 'Adornments',
        type: { summary: 'ReactNode' },
      },
    },
    endAdornment: {
      control: false,
      description: 'ReactNode at the end (icons, buttons, etc.)',
      table: {
        category: 'Adornments',
        type: { summary: 'ReactNode' },
      },
    },

    // Styling
    className: {
      control: 'text',
      description:
        'CSS class names applied to the root element (the visual input container with border and focus ring).',
      table: {
        category: 'Styling',
      },
    },
    style: {
      control: 'object',
      description:
        'Inline styles applied to the root element (the visual input container).',
      table: {
        category: 'Styling',
      },
    },

    // Internal escape hatch, not for consumer use. Use TextArea instead.
    as: { table: { disable: true } },
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
  hideErrorIcon: false,
}

export const Overview: StoryFn<InputProps> = () => (
  <>
    <Input aria-label="Default" placeholder="Default" autoComplete="off" />
    <Input
      aria-label="Invalid"
      placeholder="Invalid"
      invalid
      autoComplete="off"
    />
    <Input aria-label="Disabled" placeholder="Disabled" disabled />
  </>
)

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
Types.parameters = {
  docs: {
    description: {
      story:
        'Input accepts any native HTML input type, such as text, number or password, through the `type` prop.',
    },
  },
}

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
ValidationStates.parameters = {
  docs: {
    description: {
      story:
        'Set `invalid` to show error styling. Pair it with an accessible description of what needs fixing, such as a message linked through `aria-describedby`.',
    },
  },
}

export const States: StoryFn<InputProps> = () => (
  <>
    <Input aria-label="Default" placeholder="Default" />
    <Input aria-label="Disabled" defaultValue="Disabled value" disabled />
    <Input aria-label="Read only" defaultValue="Read only value" readOnly />
  </>
)
States.parameters = {
  docs: {
    description: {
      story:
        'An input is either at its default, disabled, or read only. Disabled inputs are not focusable and are left out of form submission. Read only inputs stay focusable and submit their value but cannot be edited.',
    },
  },
}

export const RequiredIndicator: StoryFn<InputProps> = () => (
  <>
    <Field>
      <Field.Label htmlFor="optional-example">Email</Field.Label>
      <Input id="optional-example" placeholder="name@example.com" />
    </Field>
    <Field>
      <Field.Label htmlFor="required-example" indicator="(Required)">
        Email
      </Field.Label>
      <Input id="required-example" required placeholder="name@example.com" />
    </Field>
  </>
)
RequiredIndicator.parameters = {
  docs: {
    description: {
      story:
        'The `required` prop tells assistive technology and native form validation that the field is required, but it shows no visible marker. Pair it with the `indicator` prop on `Field.Label`.',
    },
  },
}

export const Density: StoryFn<InputProps> = () => (
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
Density.parameters = {
  docs: {
    description: {
      story:
        'Use `data-density="comfortable"` on a parent element to render a more compact input. Spacious is the default density.',
    },
  },
}

export const WithAdornments: StoryFn<InputProps> = () => {
  return (
    <>
      <Input
        aria-label="With text prefix and suffix"
        type="number"
        placeholder="Amount"
        startText="€"
        endText="EUR"
      />
      <Input
        aria-label="With icon"
        type="text"
        placeholder="With icon"
        endAdornment={<Icon data={anchor} />}
      />
      <Input
        aria-label="Search"
        type="text"
        placeholder="Search"
        startAdornment={<Icon data={search} />}
        endAdornment={
          <Button variant="ghost" icon size="small" aria-label="Clear">
            <Icon data={close} />
          </Button>
        }
      />
      <Input
        aria-label="Invalid with icon"
        type="text"
        defaultValue="Invalid value"
        invalid
        endAdornment={<Icon data={anchor} />}
      />
      <Input
        aria-label="Invalid with text and adornment"
        type="text"
        defaultValue="invalid-url"
        invalid
        startText="https://"
        startAdornment={<Icon data={anchor} />}
        endText=".com"
      />
      <Input
        aria-label="Search with error"
        type="text"
        defaultValue="Invalid search"
        invalid
        hideErrorIcon
        startAdornment={<Icon data={search} />}
        endAdornment={
          <Button
            variant="ghost"
            icon
            size="small"
            tone="neutral"
            aria-label="Clear"
          >
            <Icon data={close} />
          </Button>
        }
      />
      <Input
        aria-label="Disabled with adornments"
        type="number"
        disabled
        value="100"
        endText="kg"
        endAdornment={<Icon data={anchor} />}
      />
    </>
  )
}
WithAdornments.parameters = {
  docs: {
    description: {
      story:
        'Use `startText` and `endText` for prefix or suffix text, such as a currency symbol or unit. Use `startAdornment` and `endAdornment` for elements such as icons or buttons.',
    },
  },
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
OverrideBackground.parameters = {
  docs: {
    description: {
      story:
        'Wrap the input in a container that sets the `--eds-color-neutral-1` CSS variable to customise its background colour. This overrides the base colour token the input reads for its background.',
    },
  },
}

export const LightAndDarkMode: StoryFn<InputProps> = () => {
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
        <ExampleLabel>Light mode</ExampleLabel>
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
        <ExampleLabel style={{ color: 'var(--eds-color-text-strong)' }}>
          Dark mode
        </ExampleLabel>
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
LightAndDarkMode.parameters = {
  docs: {
    description: {
      story:
        'Input adapts automatically to light and dark `data-color-scheme`, with no extra props needed.',
    },
  },
}

export const CustomStyling: StoryFn<InputProps> = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <style>
      {`
        .custom-input {
          border-radius: 999px;
          width: 300px;
        }
      `}
    </style>
    <div>
      <p style={{ marginBottom: '8px' }}>
        <code>className</code> is applied to the root container, so it can set
        border-radius and width.
      </p>
      <Input
        aria-label="Custom styled"
        placeholder="Rounded and fixed width"
        className="custom-input"
      />
    </div>
  </div>
)
CustomStyling.parameters = {
  docs: {
    description: {
      story:
        '`className` and `style` land on the root element, the visual input container with the border and focus ring. Use them to control width, border-radius, or layout. The native `<input>` inside is reached through CSS selectors.',
    },
  },
}
