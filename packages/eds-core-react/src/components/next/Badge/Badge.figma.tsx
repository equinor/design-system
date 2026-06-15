import figma from '@figma/code-connect'
import { Badge } from '.'

figma.connect(
  Badge,
  'https://www.figma.com/design/dz0XQdc5j7AAtjXr1gTfVR/%F0%9F%94%B9-EDS-Core-Components?node-id=4120-931',
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
      emphasis: figma.enum('Emphasis', {
        Low: 'low',
        Medium: 'medium',
      }),
      variant: figma.enum('Style', {
        Solid: 'solid',
        Outlined: 'outlined',
      }),
      children: figma.string('Text'),
    },
    example: ({ tone, emphasis, variant, children }) => (
      <Badge tone={tone} emphasis={emphasis} variant={variant}>
        {children}
      </Badge>
    ),
  },
)
