import type { ButtonHTMLAttributes, ReactNode } from 'react'

/**
 * Button visual style variants
 * - `primary`: Solid filled button for primary actions
 * - `outline`: Bordered button for secondary actions
 * - `ghost`: Minimal button for tertiary actions
 */
export type ButtonVariant = 'primary' | 'outline' | 'ghost'

/**
 * Button size options
 * - `small`: Compact size (28px height)
 * - `default`: Standard size (36px height)
 * - `large`: Generous size (44px height)
 */
export type ButtonSize = 'small' | 'default' | 'large'

/**
 * Color appearance for theming
 * - `accent`: Brand/action color (default)
 * - `neutral`: Neutral gray tones
 * - `danger`: Destructive/warning actions
 */
export type ButtonColorAppearance = 'accent' | 'neutral' | 'danger'

/**
 * Border radius options for icon-only buttons
 * - `default`: Square shape (4px radius)
 * - `rounded`: Circular shape (1000px radius)
 *
 * Note: This prop only applies when `icon={true}`.
 * Buttons with labels are always square (4px radius).
 */
export type ButtonRadius = 'default' | 'rounded'

export type ButtonProps = {
  /**
   * Button variant - controls visual style
   * @default 'primary'
   */
  variant?: ButtonVariant
  /**
   * Button size
   * @default 'default'
   */
  size?: ButtonSize
  /**
   * Color appearance for theming
   * @default 'accent'
   */
  colorAppearance?: ButtonColorAppearance
  /**
   * Border radius style for icon-only buttons.
   * - `default`: Square shape (4px radius)
   * - `rounded`: Circular shape (1000px radius)
   *
   * Note: Only applies when `icon={true}`. Ignored for buttons with labels.
   * @default 'default'
   */
  radius?: ButtonRadius
  /**
   * Icon-only button mode. When true, the button uses uniform padding
   * (square shape) and requires an `aria-label` for accessibility.
   *
   * @example
   * ```tsx
   * <Button icon aria-label="Add item">
   *   <Icon data={add} aria-hidden />
   * </Button>
   * ```
   * @default false
   */
  icon?: boolean
  /**
   * Button content. Can include text, icons, or a combination.
   * Icons should be placed as children in the desired order.
   *
   * @example
   * ```tsx
   * // Text only
   * <Button>Submit</Button>
   *
   * // Icon before label
   * <Button>
   *   <Icon data={add} aria-hidden />
   *   Add item
   * </Button>
   *
   * // Icon after label
   * <Button>
   *   Next
   *   <Icon data={chevron_right} aria-hidden />
   * </Button>
   * ```
   */
  children?: ReactNode
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>
