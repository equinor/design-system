import type { ComponentPropsWithRef, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md'

type ButtonStyleOptions = {
  variant?: ButtonVariant
  size?: ButtonSize
  iconOnly?: boolean
  className?: string
}

/*
 * Modelled on the EDS 2.0 Button (/next): 4px radius, EDS type sizes, hover
 * and pressed fills from the Tokens Studio interactive roles, and the global
 * :focus-visible ring from globals.css.
 */
const BASE =
  'inline-flex items-center justify-center shrink-0 rounded font-medium whitespace-nowrap cursor-pointer transition-colors duration-150 disabled:cursor-not-allowed'

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'border border-transparent bg-accent-emphasis text-accent-on-emphasis hover:bg-accent-emphasis-hover active:bg-accent-emphasis-pressed disabled:bg-disabled disabled:text-disabled',
  secondary:
    'border border-accent-emphasis bg-transparent text-accent hover:bg-accent-muted active:bg-accent-muted-hover disabled:border-disabled disabled:bg-transparent disabled:text-disabled',
  ghost:
    'border border-transparent bg-transparent text-accent hover:bg-accent-muted active:bg-accent-muted-hover disabled:bg-transparent disabled:text-disabled',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'min-h-7 gap-1.5 px-2.5 text-sm',
  md: 'min-h-9 gap-2 px-4 text-base',
}

const ICON_ONLY_SIZES: Record<ButtonSize, string> = {
  sm: 'size-7 p-0',
  md: 'size-9 p-0',
}

/**
 * The class list of an EDS-style button. Use it for links that should look
 * like buttons (`<Link className={buttonClassName({ variant: 'ghost' })}>`).
 */
export function buttonClassName({
  variant = 'secondary',
  size = 'md',
  iconOnly = false,
  className,
}: ButtonStyleOptions = {}): string {
  return [
    BASE,
    VARIANTS[variant],
    iconOnly ? ICON_ONLY_SIZES[size] : SIZES[size],
    className,
  ]
    .filter(Boolean)
    .join(' ')
}

type ButtonBaseProps = Omit<ComponentPropsWithRef<'button'>, 'aria-label'> & {
  /** Visual weight. Defaults to `secondary`. */
  variant?: ButtonVariant
  /** `sm` is 28px high, `md` 36px. Defaults to `md`. */
  size?: ButtonSize
  children: ReactNode
}

type TextButtonProps = ButtonBaseProps & {
  iconOnly?: false
  'aria-label'?: string
}

type IconOnlyButtonProps = ButtonBaseProps & {
  /** A square button that shows only an icon. */
  iconOnly: true
  /** Required: an icon-only button has no visible text to name it. */
  'aria-label': string
}

export type ButtonProps = TextButtonProps | IconOnlyButtonProps

export function Button({
  variant = 'secondary',
  size = 'md',
  iconOnly = false,
  className,
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, iconOnly, className })}
      {...rest}
    >
      {children}
    </button>
  )
}
