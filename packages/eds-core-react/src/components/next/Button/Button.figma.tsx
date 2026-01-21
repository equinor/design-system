import figma from '@figma/code-connect'
import { Button } from './Button'

/**
 * Code Connect mapping for Button component.
 *
 * Maps Figma design variants to React component props.
 * Run `npx figma connect publish` from packages/eds-core-react/ to publish.
 */

// Main Button component connection (⌘ Button - node 18:1202)
figma.connect(
  Button,
  'https://www.figma.com/design/dz0XQdc5j7AAtjXr1gTfVR/EDS-Core-Components?node-id=18-1202',
  {
    props: {
      variant: figma.enum('Variant', {
        Primary: 'primary',
        Outline: 'outline',
        Ghost: 'ghost',
      }),
      disabled: figma.enum('State', {
        Disabled: true,
      }),
      iconStart: figma.boolean('showLeadingIcon', {
        true: figma.instance('Leading Icon Item'),
        false: undefined,
      }),
      iconEnd: figma.boolean('showTrailingIcon', {
        true: figma.instance('Trailing Icon Item'),
        false: undefined,
      }),
      children: figma.string('label'),
    },
    example: ({ variant, disabled, iconStart, iconEnd, children }) => (
      <Button
        variant={variant}
        disabled={disabled}
        iconStart={iconStart}
        iconEnd={iconEnd}
      >
        {children}
      </Button>
    ),
  },
)

// Button [EDS] wrapper with tones (node 18:1193)
figma.connect(
  Button,
  'https://www.figma.com/design/dz0XQdc5j7AAtjXr1gTfVR/EDS-Core-Components?node-id=18-1193',
  {
    props: {
      colorAppearance: figma.enum('Tone', {
        Accent: 'accent',
        Neutral: 'neutral',
        Danger: 'danger',
      }),
      inner: figma.nestedProps('⌘ Button', {
        variant: figma.enum('Variant', {
          Primary: 'primary',
          Outline: 'outline',
          Ghost: 'ghost',
        }),
        disabled: figma.enum('State', {
          Disabled: true,
        }),
        children: figma.string('label'),
      }),
    },
    example: ({ colorAppearance, inner }) => (
      <Button
        variant={inner.variant}
        colorAppearance={colorAppearance}
        disabled={inner.disabled}
      >
        {inner.children}
      </Button>
    ),
  },
)
