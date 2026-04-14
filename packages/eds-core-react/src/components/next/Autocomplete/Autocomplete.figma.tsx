import figma from '@figma/code-connect'
import { Autocomplete } from '.'

figma.connect(
  Autocomplete,
  'https://www.figma.com/design/dz0XQdc5j7AAtjXr1gTfVR/%F0%9F%92%A0-EDS-Core-Components?node-id=5909-4001',
  {
    props: {
      disabled: figma.enum('State', { Disabled: true }),
      readOnly: figma.enum('State', { 'Read-only': true }),
      invalid: figma.enum('Validation', { Error: true }),
      helperMessage: figma.boolean('Helper Message', {
        true: 'Helper message',
        false: undefined,
      }),
    },
    example: ({ disabled, readOnly, invalid, helperMessage }) => (
      <Autocomplete
        label="Label"
        options={['Option 1', 'Option 2', 'Option 3']}
        disabled={disabled}
        readOnly={readOnly}
        invalid={invalid}
        helperMessage={helperMessage}
      />
    ),
  },
)
