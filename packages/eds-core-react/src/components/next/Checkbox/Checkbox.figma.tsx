import figma from '@figma/code-connect'
import { Checkbox } from './Checkbox'

/**
 * Code Connect mapping for Checkbox, from Checkbox [EDS Beta] (112:5454).
 * Hover and Focus in the State variant are interaction states, not props.
 * Without a label, the example sets an aria-label instead.
 */
figma.connect(
  Checkbox,
  'https://www.figma.com/design/dz0XQdc5j7AAtjXr1gTfVR/EDS-Core-Components?node-id=112-5454',
  {
    props: {
      label: figma.enum('No Label', { false: figma.textContent('Option') }),
      ariaLabel: figma.enum('No Label', { true: 'Label' }),
      disabled: figma.enum('State', { Disabled: true }),
      checked: figma.enum('Is Checked', { true: true }),
      indeterminate: figma.enum('Indeterminate', { true: true }),
    },
    example: ({ label, ariaLabel, disabled, checked, indeterminate }) => (
      <Checkbox
        label={label}
        aria-label={ariaLabel}
        defaultChecked={checked}
        indeterminate={indeterminate}
        disabled={disabled}
      />
    ),
  },
)
