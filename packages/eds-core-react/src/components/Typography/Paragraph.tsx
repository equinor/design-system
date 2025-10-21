import { forwardRef } from 'react'
import { ParagraphProps } from './Paragraph.types'
import { createTypographyClassNames } from './utils'

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
    const typographyClassNames = createTypographyClassNames({
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
        className={typographyClassNames}
        data-debug={debug ? '' : undefined}
        {...rest}
      >
        {children}
      </p>
    )
  },
)

Paragraph.displayName = 'Paragraph'
