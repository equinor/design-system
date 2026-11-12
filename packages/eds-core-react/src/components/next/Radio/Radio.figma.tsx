import figma from '@figma/code-connect'
import { Radio } from './Radio'

/**
 * Code Connect mapping for Radio, from Radio Button [EDS Beta] (18:3449).
 * Hover and Focus in the State variant are interaction states, not props.
 */
figma.connect(
  Radio,
  'https://www.figma.com/design/dz0XQdc5j7AAtjXr1gTfVR/EDS-Core-Components?node-id=18-3449',
  {
    props: {
      label: figma.textContent('Label'),
      disabled: figma.enum('State', { Disabled: true }),
      checked: figma.enum('Is Checked', { true: true }),
    },
    example: ({ label, disabled, checked }) => (
      <Radio
        label={label}
        name="radio-group"
        defaultChecked={checked}
        disabled={disabled}
      />
    ),
  },
)
