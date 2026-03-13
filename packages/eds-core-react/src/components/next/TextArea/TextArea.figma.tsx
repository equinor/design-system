import figma from '@figma/code-connect'
import { TextArea } from '.'

figma.connect(
  TextArea,
  'https://www.figma.com/design/dz0XQdc5j7AAtjXr1gTfVR/%F0%9F%92%A0-EDS-Core-Components?node-id=4164-18265',
  {
    props: {
      disabled: figma.enum('State', { Disabled: true }),
      invalid: figma.enum('Validation', { Error: true }),
      placeholder: figma.string('Placeholder'),
    },
    example: ({ disabled, invalid, placeholder }) => (
      <TextArea
        label="Label"
        placeholder={placeholder}
        disabled={disabled}
        invalid={invalid}
        rows={3}
      />
    ),
  },
)
