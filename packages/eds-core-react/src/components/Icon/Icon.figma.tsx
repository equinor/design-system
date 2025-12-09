import figma from '@figma/code-connect'
import { Icon } from './Icon'

/**
 * Connect the Icon component to its Figma counterpart.
 * This enables figma.instance('Icon') in parent components (like Button)
 * to automatically render the correct Icon code snippet.
 *
 * The icon name is retrieved from IconData.figma.tsx which returns
 * the icon name as a string based on the Figma component.
 */
figma.connect(
  Icon,
  'https://www.figma.com/design/dz0XQdc5j7AAtjXr1gTfVR/EDS-Core-Components?node-id=66-4156&t=J5Smd4XB6B7JpEOv-11',
  {
    props: {
      // Get the icon name string from the connected icon component in IconData.figma.tsx
      iconName: figma.instance<string>('Icon'),
    },
    example: ({ iconName }) => <Icon name={iconName} />,
  },
)
