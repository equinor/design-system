import figma from '@figma/code-connect'
import { Select } from '.'

figma.connect(
  Select,
  'https://www.figma.com/design/dz0XQdc5j7AAtjXr1gTfVR/%F0%9F%94%B9-EDS-Core-Components?node-id=2010-3074',
  {
    props: {
      disabled: figma.enum('State', { Disabled: true }),
      readOnly: figma.enum('State', { 'Read-only': true }),
      invalid: figma.enum('Validation', { Error: true }),
      label: figma.boolean('Title + Description', {
        true: 'Label',
        false: undefined,
      }),
      helperMessage: figma.boolean('Helper Message', {
        true: 'Helper message',
        false: undefined,
      }),
    },
    example: ({ disabled, readOnly, invalid, label, helperMessage }) => (
      <Select
        label={label}
        options={['Option 1', 'Option 2', 'Option 3']}
        disabled={disabled}
        readOnly={readOnly}
        invalid={invalid}
        helperMessage={helperMessage}
      />
    ),
  },
)
