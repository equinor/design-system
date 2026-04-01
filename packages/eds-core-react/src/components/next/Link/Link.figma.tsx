import figma from '@figma/code-connect'
import { Link } from '.'

figma.connect(
  Link,
  'https://www.figma.com/design/dz0XQdc5j7AAtjXr1gTfVR?node-id=2010:2899',
  {
    props: {
      variant: figma.enum('.Type', {
        Inline: 'inline',
        Standalone: 'standalone',
      }),
    },
    example: ({ variant }) => (
      <Link href="#" variant={variant}>
        Link
      </Link>
    ),
  },
)
