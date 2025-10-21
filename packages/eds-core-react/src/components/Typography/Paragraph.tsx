import { forwardRef } from 'react'
import { ParagraphProps } from './Paragraph.types'
import { buildClassName } from './typography-utils'

/**
 * Paragraph component with typography support.
 */
export const Paragraph = forwardRef<HTMLParagraphElement, ParagraphProps>(
  (
    {
      size = 'md',
      lineHeight = 'default',
      weight = 'normal',
      tracking = 'normal',
      debug,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const combinedClassName = buildClassName({
      family: 'ui',
      baseline: 'grid',
      lineHeight,
      size,
      weight,
      tracking,
      className,
    })

    return (
      <p
        ref={ref}
        className={combinedClassName}
        data-debug={debug ? '' : undefined}
        {...rest}
      >
        {children}
      </p>
    )
  },
)

Paragraph.displayName = 'Paragraph'
