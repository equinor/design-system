import figma from '@figma/code-connect'
import { Checkbox } from './Checkbox'

figma.connect(
  Checkbox,
  'https://www.figma.com/design/dz0XQdc5j7AAtjXr1gTfVR/EDS-Core-Components?node-id=112-5455&m=dev',
  {
    props: {
      label: figma.string('Label'),
      disabled: figma.boolean('Disabled'),
      indeterminate: figma.boolean('Indeterminate'),
    },
    example: ({ label, disabled, indeterminate }) => (
      <Checkbox
        label={label}
        disabled={disabled}
        indeterminate={indeterminate}
      />
    ),
  },
)
