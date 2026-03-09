import figma from '@figma/code-connect'
import { Search } from '.'

figma.connect(
  Search,
  'https://www.figma.com/design/dz0XQdc5j7AAtjXr1gTfVR?node-id=2054:3128',
  {
    props: {
      disabled: figma.enum('.State', { Disabled: true }),
      invalid: figma.enum('.Validation', { Error: true }),
    },
    example: ({ disabled, invalid }) => (
      <Search
        label="Label"
        placeholder="Search"
        disabled={disabled}
        invalid={invalid}
      />
    ),
  },
)
