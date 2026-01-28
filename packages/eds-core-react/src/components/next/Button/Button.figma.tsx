import figma from '@figma/code-connect'
import { Button } from './Button'

/**
 * Code Connect mapping for Button component.
 *
 * Maps Figma design variants to React component props.
 * Run `npx figma connect publish` from packages/eds-core-react/ to publish.
 *
 * Figma component structure:
 * - Button [EDS] (18:1193) → .Geometry Options → ⌘ Button
 * - Icon Button [EDS] (18:1373) → .Geometry Options → ⌘ Icon Button
 */

// ============================================
// Connection 1: Button [EDS] (18:1193)
// Top-level wrapper with Tone + nested geometry + nested button
// ============================================

figma.connect(
  Button,
  'https://www.figma.com/design/dz0XQdc5j7AAtjXr1gTfVR/EDS-Core-Components?node-id=18-1193',
  {
    props: {
      tone: figma.enum('Tone', {
        Accent: 'accent',
        Neutral: 'neutral',
        Danger: 'danger',
      }),
      geometry: figma.nestedProps('.Geometry Options', {
        size: figma.enum('Size', {
          Large: 'large',
          Default: 'default',
          Small: 'small',
        }),
      }),
      inner: figma.nestedProps('⌘ Button', {
        variant: figma.enum('Variant', {
          Primary: 'primary',
          Outline: 'secondary',
          Ghost: 'ghost',
        }),
        disabled: figma.enum('State', {
          Disabled: true,
        }),
        leadingIcon: figma.boolean('Show Leading Icon', {
          true: figma.instance('Leading Icon Item'),
          false: undefined,
        }),
        trailingIcon: figma.boolean('Show Trailing Icon', {
          true: figma.instance('Trailing Icon Item'),
          false: undefined,
        }),
        label: figma.string('Label'),
      }),
    },
    example: ({ tone, geometry, inner }) => (
      <Button
        variant={inner.variant}
        size={geometry.size}
        tone={tone}
        disabled={inner.disabled}
      >
        {/* TODO: Replace with actual icon components, when Icon component is
        available in Code Connect */}
        {inner.leadingIcon}
        {inner.label}
        {inner.trailingIcon}
      </Button>
    ),
  },
)

// ============================================
// Connection 2: Icon Button [EDS] (18:1373)
// Top-level wrapper with Tone + nested geometry (includes Round) + nested icon button
// ============================================

figma.connect(
  Button,
  'https://www.figma.com/design/dz0XQdc5j7AAtjXr1gTfVR/EDS-Core-Components?node-id=18-1373',
  {
    props: {
      tone: figma.enum('Tone', {
        Accent: 'accent',
        Neutral: 'neutral',
        Danger: 'danger',
      }),
      geometry: figma.nestedProps('.Geometry Options', {
        size: figma.enum('Size', {
          Large: 'large',
          Default: 'default',
          Small: 'small',
        }),
        round: figma.boolean('Round'),
      }),
      // @ts-expect-error - Code Connect's ConnectedComponent type doesn't match ReactElement
      inner: figma.nestedProps('⌘ Icon Button', {
        variant: figma.enum('Variant', {
          Primary: 'primary',
          Outline: 'secondary',
          Ghost: 'ghost',
        }),
        disabled: figma.enum('State', {
          Disabled: true,
        }),
        iconContent: figma.instance('icon'),
      }),
    },
    example: ({ tone, geometry, inner }) => (
      <Button
        icon
        variant={inner.variant}
        size={geometry.size}
        tone={tone}
        round={geometry.round}
        disabled={inner.disabled}
        /* Remember to describe the action of the icon button for accessibility */
        aria-label="[Describe action]"
      >
        {inner.iconContent}
      </Button>
    ),
  },
)
