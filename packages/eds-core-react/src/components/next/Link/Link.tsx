import { forwardRef } from 'react'
import type { LinkProps } from './Link.types'

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { variant = 'inline', startIcon, endIcon, className, children, ...rest },
  ref,
) {
  if (
    process.env.NODE_ENV !== 'production' &&
    (startIcon || endIcon) &&
    variant === 'inline'
  ) {
    console.warn(
      'Link: startIcon and endIcon are only supported with the standalone variant',
    )
  }

  const classes = ['eds-link', className].filter(Boolean).join(' ')

  return (
    <a
      ref={ref}
      className={classes}
      data-variant={variant}
      data-font-family="ui"
      {...rest}
    >
      {startIcon && <span className="eds-link__icon">{startIcon}</span>}
      {children}
      {endIcon && <span className="eds-link__icon">{endIcon}</span>}
    </a>
  )
})

Link.displayName = 'Link'
