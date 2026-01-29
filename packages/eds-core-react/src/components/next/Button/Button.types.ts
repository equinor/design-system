import type { ButtonHTMLAttributes, ReactNode } from 'react'

/**
 * Button visual style variants
 * - `primary`: Solid filled button for primary actions
 * - `secondary`: Bordered button for secondary actions
 * - `ghost`: Minimal button for tertiary actions
 */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost'

/**
 * Button size options
 * - `small`: Compact size (24px height)
 * - `default`: Standard size (36px height)
 * - `large`: Generous size (44px height)
 */
export type ButtonSize = 'small' | 'default' | 'large'

/**
 * Color tone for theming
 * - `accent`: Brand/action color (default)
 * - `neutral`: Neutral gray tones
 * - `danger`: Destructive/warning actions
 */
export type ButtonTone = 'accent' | 'neutral' | 'danger'

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
   * Color tone for theming
   * @default 'accent'
   */
  tone?: ButtonTone
  /**
   * Icon-only mode. Creates a square button optimized for a single icon.
   * Always provide `aria-label` for accessibility when using icon-only buttons.
   *
   * @default false
   *
   * @example
   * ```tsx
   * import { save } from '@equinor/eds-icons'
   * <Button icon aria-label="Save">
   *   <Icon data={save} />
   * </Button>
   * ```
   */
  icon?: boolean
  /**
   * Makes icon-only buttons circular instead of square.
   * Only applies when `icon` prop is true.
   * @default false
   */
  round?: boolean
  /**
   * Button content. Can include text, icons, or both.
   * Layout is handled automatically with CSS flexbox.
   *
   * @example
   * ```tsx
   * // Text only
   * <Button>Save</Button>
   *
   * // Icon before text
   * <Button><Icon data={save} /> Save</Button>
   *
   * // Icon after text
   * <Button>Next <Icon data={chevron_right} /></Button>
   *
   * // Icon only (requires aria-label)
   * <Button icon aria-label="Save"><Icon data={save} /></Button>
   * ```
   */
  children?: ReactNode
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>
