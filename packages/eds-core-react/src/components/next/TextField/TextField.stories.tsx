import { useState } from 'react'
import { StoryFn, Meta } from '@storybook/react-vite'
import { money } from '@equinor/eds-icons'
import { TextField } from './TextField'
import type { TextFieldProps } from './TextField.types'
import { Stack } from './../../../../.storybook/components'
import { Icon } from '../Icon'

const meta: Meta<typeof TextField> = {
  title: 'EDS 2.0 (beta)/TextField',
  component: TextField,
  tags: ['beta'],
  args: {
    // Core
    placeholder: '',
    // States
    disabled: false,
    invalid: false,
    readOnly: false,
    required: false,
  },
  argTypes: {
    // Core
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

    // Label
    label: {
      control: 'text',
      description: 'Label text for the field',
      table: {
        category: 'Label',
      },
    },
    labelInfo: {
      control: 'text',
      description: 'Info tooltip content shown next to the label',
      table: {
        category: 'Label',
      },
    },
    indicator: {
      control: 'text',
      description:
        'Indicator text shown after label, e.g. "(Required)" or "(Optional)"',
      table: {
        category: 'Label',
      },
    },

    // Content
    description: {
      control: 'text',
      description: 'Descriptive text displayed below the label',
      table: {
        category: 'Content',
      },
    },
    helperMessage: {
      control: 'text',
      description: 'Helper or validation message shown below the input',
      table: {
        category: 'Content',
      },
    },

    // States
    invalid: {
      control: 'boolean',
      description: 'Shows error styling with red border and error icon',
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
      description: 'Sets HTML required attribute for form validation',
      table: {
        category: 'States',
        defaultValue: { summary: 'false' },
      },
    },

    // Adornments
    startText: {
      control: 'text',
      description:
        'Text at the start (e.g., "$", "https://"). Always neutral color.',
      table: {
        category: 'Adornments',
      },
    },
    endText: {
      control: 'text',
      description:
        'Text at the end (e.g., "kg", "%", "USD"). Always neutral color.',
      table: {
        category: 'Adornments',
      },
    },
    startAdornment: {
      control: false,
      description:
        'ReactNode at the start (icons, buttons). Inherits state color (red when invalid).',
      table: {
        category: 'Adornments',
        type: { summary: 'ReactNode' },
      },
    },
    endAdornment: {
      control: false,
      description:
        'ReactNode at the end (icons, buttons). Inherits state color (red when invalid).',
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
    id: {
      control: 'text',
      description:
        'Unique identifier for the field (auto-generated if not provided)',
      table: {
        category: 'Other',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
**⚠️ Beta Component** - This component is under active development and may have breaking changes.

\`\`\`bash
npm install @equinor/eds-core-react@beta
\`\`\`

\`\`\`tsx
import { TextField } from '@equinor/eds-core-react/next'
\`\`\`

TextField is a pre-composed component that combines Label, FieldDescription, Input, and HelperMessage. 
For more flexibility, use the individual components via the Field composition pattern.
        `,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <Stack align="stretch" direction="column" style={{ maxWidth: '320px' }}>
          <Story />
        </Stack>
      )
    },
  ],
}

export default meta

export const Introduction: StoryFn<TextFieldProps> = (args) => {
  return <TextField {...args} />
}

Introduction.args = {
  label: 'Label',
  labelInfo: 'Tooltip text',
  description: 'Help with more details',
  placeholder: 'Placeholder',
  helperMessage: 'Helper Message',
}

export const WithIndicator: StoryFn<TextFieldProps> = () => (
  <>
    <TextField label="Default field" placeholder="No indicator" />
    <TextField
      label="Email"
      indicator="(Required)"
      required
      placeholder="Required field"
    />
    <TextField
      label="Nickname"
      indicator="(Optional)"
      placeholder="Optional field"
    />
  </>
)
WithIndicator.parameters = {
  docs: {
    description: {
      story:
        'Use `indicator` to show text like "(Required)" or "(Optional)" next to the label. The `required` prop sets the HTML required attribute for form validation - these are separate concerns.',
    },
  },
}

export const WithDescription: StoryFn<TextFieldProps> = () => (
  <TextField
    label="Label"
    description="Help with more details"
    placeholder="Placeholder"
  />
)
WithDescription.storyName = 'With Description'

export const WithHelperMessage: StoryFn<TextFieldProps> = () => (
  <TextField
    label="Label"
    placeholder="Placeholder"
    helperMessage="Helper Message"
  />
)
WithHelperMessage.storyName = 'With Helper Message'

export const InvalidState: StoryFn<TextFieldProps> = () => (
  <TextField
    label="Label"
    placeholder="Placeholder"
    defaultValue="Invalid value"
    invalid
    helperMessage="This field has an error"
  />
)
InvalidState.storyName = 'Invalid State'

export const DisabledState: StoryFn<TextFieldProps> = () => (
  <>
    <TextField
      label="Label"
      placeholder="Placeholder"
      disabled
      helperMessage="Helper Message"
    />
    <TextField
      label="Label"
      defaultValue="Disabled with value"
      disabled
      helperMessage="Helper Message"
    />
  </>
)
DisabledState.storyName = 'Disabled State'

export const ReadOnlyState: StoryFn<TextFieldProps> = () => (
  <TextField
    label="Label"
    defaultValue="Read only value"
    readOnly
    helperMessage="Helper Message"
  />
)
ReadOnlyState.storyName = 'Read Only State'

export const FullExample: StoryFn<TextFieldProps> = () => (
  <TextField
    label="Amount"
    indicator="(Optional)"
    description="Enter the transaction amount"
    placeholder="0.00"
    type="number"
    helperMessage="Helper Message"
    labelInfo="This field accepts decimal values for currency amounts."
    startText="NOK"
    endAdornment={<Icon data={money} />}
  />
)
FullExample.storyName = 'Full Example'

export const WithLabelInfo: StoryFn<TextFieldProps> = () => (
  <>
    <TextField
      label="Email"
      placeholder="user@example.com"
      labelInfo="We'll use this email for account recovery and important notifications."
    />
    <TextField
      label="API Key"
      indicator="(Required)"
      required
      placeholder="Enter your API key"
      labelInfo="You can find your API key in the developer settings of your account."
    />
    <TextField
      label="Username"
      indicator="(Optional)"
      placeholder="Without info tooltip"
    />
  </>
)
WithLabelInfo.storyName = 'With Label Info Tooltip'
WithLabelInfo.parameters = {
  docs: {
    description: {
      story:
        'Use `labelInfo` to provide additional context via a tooltip. Hover or focus the info icon to see the tooltip content.',
    },
  },
}

export const DensityModes: StoryFn<TextFieldProps> = () => {
  const [spaciousPassword, setSpaciousPassword] = useState('')
  const [comfortablePassword, setComfortablePassword] = useState('')
  const minLength = 8

  const getSpaciousError = () => {
    if (spaciousPassword.length === 0) return false
    return spaciousPassword.length < minLength
  }

  const getComfortableError = () => {
    if (comfortablePassword.length === 0) return false
    return comfortablePassword.length < minLength
  }

  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      <div data-density="spacious" style={{ width: '320px' }}>
        <h3 style={{ marginBottom: '1rem' }}>Spacious</h3>
        <Stack>
          <TextField
            label="Email"
            placeholder="user@example.com"
            labelInfo="Additional context about this field"
          />
          <TextField
            label="Password"
            type="password"
            indicator="(Required)"
            required
            placeholder="Enter password"
            value={spaciousPassword}
            onChange={(e) => setSpaciousPassword(e.target.value)}
            invalid={getSpaciousError()}
            helperMessage="Must be at least 8 characters"
          />
        </Stack>
      </div>
      <div data-density="comfortable" style={{ width: '320px' }}>
        <h3 style={{ marginBottom: '1rem' }}>Comfortable</h3>
        <Stack>
          <TextField
            label="Email"
            placeholder="user@example.com"
            labelInfo="Additional context about this field"
          />
          <TextField
            label="Password"
            type="password"
            indicator="(Required)"
            required
            placeholder="Enter password"
            value={comfortablePassword}
            onChange={(e) => setComfortablePassword(e.target.value)}
            invalid={getComfortableError()}
            helperMessage="Must be at least 8 characters"
          />
        </Stack>
      </div>
    </div>
  )
}
DensityModes.storyName = 'Density Modes'
DensityModes.parameters = {
  docs: {
    description: {
      story:
        'TextField adapts to density modes via `data-density` attribute. Spacious mode is the default with larger sizing, while comfortable mode provides a more compact layout. Try typing in the password fields to see live validation.',
    },
  },
}
