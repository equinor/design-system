import figma from '@figma/code-connect'
import { Divider } from './Divider'

figma.connect(
  Divider,
  'https://www.figma.com/design/dz0XQdc5j7AAtjXr1gTfVR/EDS-Core-Components?node-id=4540-103914',
  {
    example: () => <Divider />,
  },
)
