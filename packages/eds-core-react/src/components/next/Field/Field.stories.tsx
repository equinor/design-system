import { StoryFn, Meta } from '@storybook/react-vite'
import { Field } from './Field'
import type { FieldProps } from './Field.types'
import { Input } from '../Input'
import { Label } from '../Label'
import { ValidationMessage } from '../ValidationMessage'
import { Stack } from './../../../../.storybook/components'

const meta: Meta<typeof Field> = {
  title: 'EDS 2.0 (beta)/Field',
  component: Field,
  tags: ['beta'],
  argTypes: {},
  parameters: {
    docs: {
      description: {
        component: `
**⚠️ Beta Component** - This component is under active development and may have breaking changes.

\`\`\`bash
npm install @equinor/eds-core-react@beta
\`\`\`

\`\`\`tsx
import { Field, Input, Label, ValidationMessage } from '@equinor/eds-core-react/next'
\`\`\`

Field is a compound component that provides consistent layout and spacing for form fields.
Use it together with Label, Field.Description, Input, and ValidationMessage.

For a simpler props-based API, use the TextField component.
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

export const Introduction: StoryFn<FieldProps> = () => (
  <Field>
    <Label htmlFor="field-intro" label="Label" />
    <Field.Description>Help with more details</Field.Description>
    <Input id="field-intro" placeholder="Placeholder" />
    <ValidationMessage>Helper Message</ValidationMessage>
  </Field>
)

export const WithOptionalLabel: StoryFn<FieldProps> = () => (
  <Field>
    <Label htmlFor="field-optional" label="Label" optional />
    <Field.Description>Help with more details</Field.Description>
    <Input id="field-optional" placeholder="Placeholder" />
    <ValidationMessage>Helper Message</ValidationMessage>
  </Field>
)
WithOptionalLabel.storyName = 'With Optional Label'

export const WithRequiredLabel: StoryFn<FieldProps> = () => (
  <Field>
    <Label htmlFor="field-required" label="Label" required />
    <Field.Description>Help with more details</Field.Description>
    <Input id="field-required" placeholder="Placeholder" required />
    <ValidationMessage>Helper Message</ValidationMessage>
  </Field>
)
WithRequiredLabel.storyName = 'With Required Label'
WithRequiredLabel.parameters = {
  docs: {
    description: {
      story:
        'When a field is required, set `required` on both Label (for visual indicator) and Input (for HTML validation).',
    },
  },
}

export const RequiredWithoutIndicator: StoryFn<FieldProps> = () => (
  <Field>
    <Label htmlFor="field-required-silent" label="Label" />
    <Field.Description>
      This field is required but without visual indicator
    </Field.Description>
    <Input id="field-required-silent" placeholder="Placeholder" required />
    <ValidationMessage>Helper Message</ValidationMessage>
  </Field>
)
RequiredWithoutIndicator.storyName = 'Required Without Indicator'
RequiredWithoutIndicator.parameters = {
  docs: {
    description: {
      story:
        'When all fields in a form are required, you may skip the "(Required)" text. Set `required` only on Input for HTML validation and accessibility.',
    },
  },
}

export const WithError: StoryFn<FieldProps> = () => (
  <Field>
    <Label htmlFor="field-error" label="Label" />
    <Input id="field-error" defaultValue="Invalid value" invalid />
    <ValidationMessage>This field has an error</ValidationMessage>
  </Field>
)
WithError.storyName = 'With Error'

export const Disabled: StoryFn<FieldProps> = () => (
  <Field>
    <Label htmlFor="field-disabled" label="Label" />
    <Field.Description>Help with more details</Field.Description>
    <Input id="field-disabled" placeholder="Placeholder" disabled />
    <ValidationMessage disabled>Helper Message</ValidationMessage>
  </Field>
)
Disabled.storyName = 'Disabled'

export const WithAdornments: StoryFn<FieldProps> = () => (
  <Field>
    <Label htmlFor="field-adornments" label="Amount" required />
    <Field.Description>Enter the amount in USD</Field.Description>
    <Input
      id="field-adornments"
      type="number"
      placeholder="0.00"
      leftAdornments={<span data-color-appearance="neutral">$</span>}
      rightAdornments={<span data-color-appearance="neutral">USD</span>}
      required
    />
    <ValidationMessage>Amount must be between $1 and $10,000</ValidationMessage>
  </Field>
)
WithAdornments.storyName = 'With Adornments'

export const MinimalField: StoryFn<FieldProps> = () => (
  <Field>
    <Label htmlFor="field-minimal" label="Label" />
    <Input id="field-minimal" placeholder="Placeholder" />
  </Field>
)
MinimalField.storyName = 'Minimal (Label + Input only)'
