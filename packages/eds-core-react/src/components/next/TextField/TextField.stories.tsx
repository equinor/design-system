import { useState } from 'react'
import { StoryFn, Meta } from '@storybook/react-vite'
import { money } from '@equinor/eds-icons'
import { TextField } from './TextField'
import type { TextFieldProps } from './TextField.types'
import { ExampleLabel, Stack } from './../../../../.storybook/components'
import { Icon } from '../Icon'
import page from './TextField.docs.mdx'

const meta: Meta<typeof TextField> = {
  title: 'EDS 2.0 (beta)/Inputs/TextField',
  component: TextField,
  tags: ['beta'],
  args: {
    // Core
    placeholder: '',
    // States
    disabled: false,
    invalid: false,
    hideErrorIcon: false,
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
        'Text shown after the label to mark the field as required or optional, for example "(Required)". It is only visible text and does not make the field required.',
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
    hideErrorIcon: {
      control: 'boolean',
      description:
        'Hide error icon when invalid. Keep false (default) for standard form fields. Only set to true when composing custom components where the error icon is not applicable.',
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
        'Marks the field as required for assistive technology and form validation. It shows no visible marker, so add an `indicator` as well.',
      table: {
        category: 'States',
        defaultValue: { summary: 'false' },
      },
    },

    // Adornments
    startText: {
      control: 'text',
      description: 'Text at the start (e.g., "$", "https://").',
      table: {
        category: 'Adornments',
      },
    },
    endText: {
      control: 'text',
      description: 'Text at the end (e.g., "kg", "%", "USD").',
      table: {
        category: 'Adornments',
      },
    },
    startAdornment: {
      control: false,
      description: 'ReactNode at the start (icons, buttons, etc.).',
      table: {
        category: 'Adornments',
        type: { summary: 'ReactNode' },
      },
    },
    endAdornment: {
      control: false,
      description: 'ReactNode at the end (icons, buttons, etc.).',
      table: {
        category: 'Adornments',
        type: { summary: 'ReactNode' },
      },
    },

    // Styling
    className: {
      control: 'text',
      description:
        'CSS class names applied to the root element (the outer labeled field wrapper). Use this to control layout, width, or margin of the entire field.',
      table: {
        category: 'Styling',
      },
    },
    style: {
      control: 'object',
      description:
        'Inline styles applied to the root element (the outer labeled field wrapper).',
      table: {
        category: 'Styling',
      },
    },

    // Other
    id: {
      control: 'text',
      description:
        'Unique identifier for the field (auto-generated if not provided)',
      table: {
        category: 'Other',
      },
    },
    // `as` is an internal escape hatch for TextArea, so it stays out of the
    // playground.
    as: {
      table: { disable: true },
    },
  },
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

export const Overview: StoryFn<TextFieldProps> = () => (
  <>
    <TextField label="Email" placeholder="name@example.com" />
    <TextField
      label="Password"
      type="password"
      indicator="(Required)"
      description="Use at least 8 characters"
      helperMessage="You can change it later in settings"
    />
  </>
)

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
        'Use `indicator` to show text such as "(Required)" or "(Optional)" next to the label. The `required` prop sets the HTML required attribute for form validation, and the two are separate.',
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
WithDescription.parameters = {
  docs: {
    description: {
      story:
        'Use `description` for extra context that should be read before the field, such as the format that is expected.',
    },
  },
}

export const WithHelperMessage: StoryFn<TextFieldProps> = () => (
  <TextField
    label="Label"
    placeholder="Placeholder"
    helperMessage="Helper Message"
  />
)
WithHelperMessage.parameters = {
  docs: {
    description: {
      story:
        'Use `helperMessage` for a hint below the field. When the field is invalid, it explains what to fix.',
    },
  },
}

export const InvalidState: StoryFn<TextFieldProps> = () => (
  <TextField
    label="Label"
    placeholder="Placeholder"
    defaultValue="Invalid value"
    invalid
    helperMessage="This field has an error"
  />
)
InvalidState.parameters = {
  docs: {
    description: {
      story:
        'Set `invalid` to show the error border and icon. The helper message is announced as an alert, so use it to say what is wrong.',
    },
  },
}

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
DisabledState.parameters = {
  docs: {
    description: {
      story:
        'A disabled field cannot be focused or edited, and its value is not submitted with a form.',
    },
  },
}

export const ReadOnlyState: StoryFn<TextFieldProps> = () => (
  <TextField
    label="Label"
    defaultValue="Read only value"
    readOnly
    helperMessage="Helper Message"
  />
)
ReadOnlyState.parameters = {
  docs: {
    description: {
      story:
        'A read only field keeps its value visible and focusable, but it cannot be edited. Its value is still submitted with a form.',
    },
  },
}

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
FullExample.parameters = {
  docs: {
    description: {
      story:
        'A field that combines a label, an indicator, a description, a helper message, a label tooltip, start text and an end icon.',
    },
  },
}

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
WithLabelInfo.parameters = {
  docs: {
    description: {
      story:
        'Use `labelInfo` to give extra context in a tooltip next to the label. Hover or focus the info icon to read the tooltip.',
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
        <ExampleLabel>Spacious</ExampleLabel>
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
        <ExampleLabel>Comfortable</ExampleLabel>
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
DensityModes.parameters = {
  docs: {
    description: {
      story:
        'TextField adapts to density modes via `data-density` attribute. Spacious mode is the default with larger sizing, while comfortable mode provides a more compact layout. Try typing in the password fields to see live validation.',
    },
  },
}
