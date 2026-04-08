import figma from '@figma/code-connect'
import { Tooltip } from '.'

figma.connect(
  Tooltip,
  'https://www.figma.com/design/dz0XQdc5j7AAtjXr1gTfVR/EDS-Core-Components?node-id=112-4183',
  {
    props: {
      title: figma.string('text'),
      placement: figma.enum('Tip position', {
        Top: 'top',
        Bottom: 'bottom',
        Left: 'left',
        Right: 'right',
      }),
    },
    example: ({ title, placement }) => (
      <Tooltip title={title} placement={placement}>
        <button>Trigger</button>
      </Tooltip>
    ),
  },
)
