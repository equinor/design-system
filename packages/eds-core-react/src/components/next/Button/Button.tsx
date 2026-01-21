import { forwardRef, Children } from 'react'
import { TypographyNext } from '../../Typography'
import type { ButtonProps } from './Button.types'
import './button.css'

const sizeToSelectableSpace = {
  small: 'sm',
  default: 'md',
  large: 'lg',
} as const

const sizeToIconSpace = {
  small: '3xs',
  default: '2xs',
  large: 'xs',
} as const

const sizeToTypographySize = {
  small: 'md',
  default: 'lg',
  large: 'xl',
} as const

/**
 * Button component for triggering actions.
 *
 * Supports three variants (primary, outline, ghost), three sizes (small, default, large),
 * and three color appearances (accent, neutral, danger) through `data-color-appearance`.
 *
 * Icons are rendered as children in the desired order. Use the `icon` prop for icon-only
 * buttons, which require an `aria-label` for accessibility.
 *
 * Icon-only buttons can be square (default) or circular using `radius="rounded"`.
 *
 * @example
 * ```tsx
 * import { Button } from '@equinor/eds-core-react/next'
 * import { Icon } from '@equinor/eds-core-react/next'
 * import { add, chevron_right } from '@equinor/eds-icons'
 *
 * // Primary button
 * <Button variant="primary">Submit</Button>
 *
 * // Button with icon before label
 * <Button>
 *   <Icon data={add} aria-hidden />
 *   Add item
 * </Button>
 *
 * // Button with icon after label
 * <Button>
 *   Next
 *   <Icon data={chevron_right} aria-hidden />
 * </Button>
 *
 * // Icon-only button (square)
 * <Button icon aria-label="Add item">
 *   <Icon data={add} aria-hidden />
 * </Button>
 *
 * // Icon-only button (circular)
 * <Button icon radius="rounded" aria-label="Add item">
 *   <Icon data={add} aria-hidden />
 * </Button>
 *
 * // Danger ghost button
 * <Button variant="ghost" colorAppearance="danger">
 *   Delete
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'default',
      colorAppearance = 'accent',
      radius = 'default',
      icon = false,
      children,
      className,
      disabled,
      type = 'button',
      ...rest
    },
    ref,
  ) {
    const typographySize = sizeToTypographySize[size]

    const renderChildren = () => {
      // Icon-only mode: render children directly without wrapping
      if (icon) {
        return children
      }

      // Map through children: wrap text nodes in TypographyNext, pass elements through
      return Children.map(children, (child) => {
        // Text nodes (strings and numbers) get wrapped in TypographyNext
        if (typeof child === 'string' || typeof child === 'number') {
          return (
            <TypographyNext
              as="span"
              family="ui"
              size={typographySize}
              baseline="center"
            >
              {child}
            </TypographyNext>
          )
        }
        // Elements (Icon, etc.) pass through unchanged
        return child
      })
    }

    const classes = ['eds-button', className].filter(Boolean).join(' ')

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled}
        data-variant={variant}
        data-color-appearance={disabled ? 'neutral' : colorAppearance}
        data-selectable-space={!icon ? sizeToSelectableSpace[size] : undefined}
        data-horizontal-space={icon ? sizeToIconSpace[size] : undefined}
        data-vertical-space={icon ? sizeToIconSpace[size] : undefined}
        data-font-size={typographySize}
        data-icon-only={icon || undefined}
        data-radius={icon ? radius : undefined}
        {...rest}
      >
        {renderChildren()}
      </button>
    )
  },
)

Button.displayName = 'Button'
