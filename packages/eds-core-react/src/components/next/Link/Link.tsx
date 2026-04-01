import { forwardRef } from 'react'
import type { LinkProps } from './Link.types'

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { variant = 'inline', className, children, ...rest },
  ref,
) {
  const classes = ['eds-link', className].filter(Boolean).join(' ')

  return (
    <a
      ref={ref}
      className={classes}
      data-variant={variant}
      data-font-family={variant === 'standalone' ? 'ui' : undefined}
      data-font-size={variant === 'standalone' ? 'md' : undefined}
      data-line-height={variant === 'standalone' ? 'squished' : undefined}
      {...rest}
    >
      {children}
    </a>
  )
})

Link.displayName = 'Link'
