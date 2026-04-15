import figma from '@figma/code-connect'
import { Chip } from '.'

figma.connect(
  Chip,
  'https://www.figma.com/design/dz0XQdc5j7AAtjXr1gTfVR/EDS-Core-Components?node-id=3853-3622&m=dev',
  {
    props: {
      tone: figma.enum('Tone', {
        Neutral: 'neutral',
        Accent: 'accent',
        Success: 'success',
        Info: 'info',
        Warning: 'warning',
        Error: 'danger',
      }),
      type: figma.enum('Type', {
        Default: 'default',
        Deletable: 'deletable',
        Checked: 'checked',
        Dropdown: 'dropdown',
      }),
      style: figma.enum('Style', {
        Default: 'default',
        Outlined: 'outlined',
        'High contrast': 'high-contrast',
      }),
    },
    example: ({ tone, type, style }) => (
      <Chip
        tone={tone}
        variant={style}
        selected={type === 'checked'}
        deletable={type === 'deletable'}
        dropdown={type === 'dropdown'}
      >
        Label
      </Chip>
    ),
  },
)
