import { StoryFn, Meta } from '@storybook/react-vite'
import { TextField } from './TextField'
import type { TextFieldProps } from './TextField.types'
import { Stack } from './../../../../.storybook/components'

const meta: Meta<typeof TextField> = {
  title: 'EDS 2.0 (beta)/TextField',
  component: TextField,
  tags: ['beta'],
  args: {
    disabled: false,
    invalid: false,
    optional: false,
    required: false,
    requiredSilent: false,
  },
  argTypes: {
    label: {
      control: 'text',
    },
    optional: {
      control: 'boolean',
      description: 'Shows "(Optional)" indicator in the label',
      table: { defaultValue: { summary: 'false' } },
    },
    required: {
      control: 'boolean',
      description:
        'Shows "(Required)" indicator in the label and sets required/aria-required on the input',
      table: { defaultValue: { summary: 'false' } },
    },
    requiredSilent: {
      control: 'boolean',
      description:
        'Sets required/aria-required on the input without showing indicator (for forms where most fields are required)',
      table: { defaultValue: { summary: 'false' } },
    },
    description: {
      control: 'text',
    },
    validationMessage: {
      control: 'text',
    },
    placeholder: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    invalid: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
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

TextField is a pre-composed component that combines Label, FieldDescription, Input, and ValidationMessage. 
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
  description: 'Help with more details',
  placeholder: 'Placeholder',
  validationMessage: 'Helper Message',
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

export const WithValidationMessage: StoryFn<TextFieldProps> = () => (
  <TextField
    label="Label"
    placeholder="Placeholder"
    validationMessage="Helper Message"
  />
)
WithValidationMessage.storyName = 'With Validation Message'

export const InvalidState: StoryFn<TextFieldProps> = () => (
  <TextField
    label="Label"
    placeholder="Placeholder"
    defaultValue="Invalid value"
    invalid
    validationMessage="This field has an error"
  />
)
InvalidState.storyName = 'Invalid State'

export const DisabledState: StoryFn<TextFieldProps> = () => (
  <>
    <TextField
      label="Label"
      placeholder="Placeholder"
      disabled
      validationMessage="Helper Message"
    />
    <TextField
      label="Label"
      defaultValue="Disabled with value"
      disabled
      validationMessage="Helper Message"
    />
  </>
)
DisabledState.storyName = 'Disabled State'

export const ReadOnlyState: StoryFn<TextFieldProps> = () => (
  <TextField
    label="Label"
    defaultValue="Read only value"
    readOnly
    validationMessage="Helper Message"
  />
)
ReadOnlyState.storyName = 'Read Only State'

export const FullExample: StoryFn<TextFieldProps> = () => (
  <TextField
    label="Label"
    optional
    description="Help with more details"
    placeholder="Placeholder"
    validationMessage="Helper Message"
  />
)
FullExample.storyName = 'Full Example'
