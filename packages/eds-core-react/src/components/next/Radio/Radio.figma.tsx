import figma from '@figma/code-connect'
import { Radio } from './Radio'

figma.connect(
  Radio,
  'https://www.figma.com/design/dz0XQdc5j7AAtjXr1gTfVR/EDS-Core-Components?node-id=112-6322',
  {
    props: {
      label: figma.string('Label'),
      disabled: figma.boolean('Disabled'),
    },
    example: ({ label, disabled }) => (
      <Radio label={label} disabled={disabled} name="radio-group" />
    ),
  },
)
