import { forwardRef } from 'react'
import type { LinkProps } from './Link.types'
import { Slot } from '../Slot'

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { variant = 'inline', asChild, className, children, ...rest },
  ref,
) {
  const classes = ['eds-link', className].filter(Boolean).join(' ')

  const sharedProps = {
    ref,
    className: classes,
    'data-variant': variant,
    'data-color-appearance': 'info',
    'data-font-family': variant === 'standalone' ? 'ui' : undefined,
    'data-font-size': variant === 'standalone' ? 'md' : undefined,
    'data-line-height': variant === 'standalone' ? 'squished' : undefined,
    ...rest,
  }

  if (asChild) {
    return <Slot {...sharedProps}>{children}</Slot>
  }

  return <a {...sharedProps}>{children}</a>
})

Link.displayName = 'Link'
