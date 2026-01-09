import React from 'react'
import figma from '@figma/code-connect'
import { Accordion } from './Accordion'

/**
 * Code Connect for Accordion component.
 *
 * Connects the React Accordion component to the Figma design.
 * - Accordion [EDS] (2096:766) - Public component with State variants (Default, Hover, Disabled)
 * - .⌘ Accordion - Internal nested component with Open variants (true/false)
 */

// Main Accordion component - connects to "Accordion [EDS]" component set
// Uses nestedProps to access the internal .⌘ Accordion component properties
figma.connect(
  Accordion,
  'https://www.figma.com/design/dz0XQdc5j7AAtjXr1gTfVR/EDS-Core-Components?node-id=2096-766',
  {
    props: {
      disabled: figma.enum('State', {
        Disabled: true,
      }),
      // Access nested internal component .⌘ Accordion
      accordion: figma.nestedProps('⌘ Accordion', {
        open: figma.enum('Open', {
          true: true,
          false: false,
        }),
      }),
    },
    example: ({ disabled, accordion }) => (
      <Accordion disabled={disabled} defaultOpen={accordion.open}>
        <Accordion.Header>Accordion Header</Accordion.Header>
        <Accordion.Content>Accordion content goes here</Accordion.Content>
      </Accordion>
    ),
  },
)
