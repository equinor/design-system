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
   * @default 'neutral'
   */
  colorAppearance?: ButtonColorAppearance
  /**
   * Icon element to display before the label.
   * Should be an Icon component from eds-core-react/next.
   * @example
   * ```tsx
   * <Button iconStart={<Icon data={add} />}>Add item</Button>
   * ```
   */
  iconStart?: ReactNode
  /**
   * Icon element to display after the label.
   * Should be an Icon component from eds-core-react/next.
   * @example
   * ```tsx
   * <Button iconEnd={<Icon data={chevron_right} />}>Next</Button>
   * ```
   */
  iconEnd?: ReactNode
  /**
   * Button content/label
   */
  children?: ReactNode
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>
