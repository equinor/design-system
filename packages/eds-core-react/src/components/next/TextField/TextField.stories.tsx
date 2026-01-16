import { StoryFn, Meta } from '@storybook/react-vite'
import { TextField } from './TextField'
import type { TextFieldProps } from './TextField.types'
import { Stack } from './../../../../.storybook/components'

const meta: Meta<typeof TextField> = {
  title: 'EDS 2.0 (beta)/TextField',
  component: TextField,
  tags: ['beta'],
  args: {
    // Core
    placeholder: '',
    // Label
    optional: false,
    required: false,
    requiredSilent: false,
    // States
    disabled: false,
    invalid: false,
    readOnly: false,
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
    optional: {
      control: 'boolean',
      description: 'Shows "(Optional)" indicator in the label',
      table: {
        category: 'Label',
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: 'boolean',
      description:
        'Shows "(Required)" indicator in the label and sets required/aria-required on the input',
      table: {
        category: 'Label',
        defaultValue: { summary: 'false' },
      },
    },
    requiredSilent: {
      control: 'boolean',
      description:
        'Sets required/aria-required on the input without showing indicator (for forms where most fields are required)',
      table: {
        category: 'Label',
        defaultValue: { summary: 'false' },
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

export const WithOptionalLabel: StoryFn<TextFieldProps> = () => (
  <TextField label="Label" optional placeholder="Placeholder" />
)
WithOptionalLabel.storyName = 'With Optional Label'

export const WithRequiredLabel: StoryFn<TextFieldProps> = () => (
  <TextField label="Label" required placeholder="Placeholder" />
)
WithRequiredLabel.storyName = 'With Required Label'

export const WithRequiredSilent: StoryFn<TextFieldProps> = () => (
  <>
    <TextField
      label="Email"
      requiredSilent
      placeholder="Required but no indicator"
    />
    <TextField label="Nickname" optional placeholder="Optional field" />
    <TextField
      label="Phone"
      requiredSilent
      placeholder="Required but no indicator"
    />
  </>
)
WithRequiredSilent.storyName = 'Required Silent (Most Fields Required Form)'
WithRequiredSilent.parameters = {
  docs: {
    description: {
      story:
        'Use `requiredSilent` when most fields in a form are required. This sets the HTML `required` attribute for validation and accessibility, but does not show "(Required)" text. Only mark optional fields with `optional`.',
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
    label="Label"
    optional
    description="Help with more details"
    placeholder="Placeholder"
    helperMessage="Helper Message"
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
      required
      placeholder="Enter your API key"
      labelInfo="You can find your API key in the developer settings of your account."
    />
    <TextField label="Username" optional placeholder="Without info tooltip" />
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
