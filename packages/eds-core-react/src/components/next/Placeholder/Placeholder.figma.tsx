/**
 * Example Code Connect file for EDS components.
 *
 * This file demonstrates how to connect a React component to its Figma counterpart.
 * Code Connect files should be placed alongside the component they connect.
 *
 * To use Code Connect:
 * 1. Copy this file as a template for your component
 * 2. Update the import and component reference
 * 3. Replace the Figma URL with your component's URL (right-click → "Copy link to selection")
 * 4. Map Figma properties to code props
 * 5. Run `npx figma connect publish` from packages/eds-core-react/
 *
 * See FIGMA_CODE_CONNECT.md for full documentation.
 */

import figma from '@figma/code-connect'
import { Placeholder } from './Placeholder'

figma.connect(
  Placeholder,
  // Replace with actual Figma component URL (right-click component → "Copy link to selection")
  'https://www.figma.com/design/dz0XQdc5j7AAtjXr1gTfVR/EDS-Core-Components?node-id=XX-YYYY',
  {
    props: {
      // Map Figma properties to code props
      // Examples:
      // label: figma.string('Label'),                    // String property
      // disabled: figma.boolean('Disabled'),             // Boolean property
      // variant: figma.enum('Variant', {                 // Enum/variant property
      //   'Primary': 'primary',
      //   'Secondary': 'secondary',
      // }),
      // icon: figma.children('Icon'),                    // Nested instance
      // text: figma.textContent('Text Layer'),           // Text content from layer

      // Nested component example - access properties from a nested layer
      // The layer name in Figma often starts with ⌘ for base components
      basePlaceholder: figma.nestedProps('⌘ Placeholder', {
        text: figma.textContent('Label'),
        // Add more nested props as needed
      }),
    },
    example: ({ basePlaceholder }) => (
      <Placeholder text={basePlaceholder.text} />
    ),
  },
)
