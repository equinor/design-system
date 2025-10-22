import { forwardRef } from 'react'
import { HeadingProps } from './Heading.types'
import { FontSize } from './types'
import { createTypographyClassNames } from './utils'

const getHeadingSize = (as: HeadingProps['as']): FontSize => {
  switch (as) {
    case 'h1':
      return '6xl'
    case 'h2':
      return '5xl'
    case 'h3':
      return '4xl'
    case 'h4':
      return '3xl'
    case 'h5':
      return '2xl'
    case 'h6':
      return 'xl'
    default:
      return '6xl'
  }
}

/**
 * Heading component for semantic headings (h1-h6).
 * Uses the design system's typography styles for headings.
 */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      lineHeight = 'default',
      weight = 'normal',
      tracking = 'normal',
      debug,
      className,
      as,
      ...rest
    },
    ref,
  ) => {
    const typographyClassNames = createTypographyClassNames({
      family: 'header',
      baseline: 'grid',
      lineHeight,
      size: getHeadingSize(as),
      weight,
      tracking,
      className,
    })

    const Component = as

    return (
      <Component
        ref={ref}
        className={typographyClassNames}
        data-debug={debug ? '' : undefined}
        {...rest}
      />
    )
  },
)

Heading.displayName = 'Heading'
