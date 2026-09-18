import { forwardRef } from 'react'
import { HeadingProps } from './Heading.types'
import { FontSize } from './types'
import { TypographyNext } from './Typography.new'

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
 * @deprecated Avoid new adoption — every new use has to be undone when the replacement
 * lands. The component still works. A CSS-first replacement is in progress: a base element
 * stylesheet (#5477) gives `h1`–`h6` default sizes and flow spacing, and utility classes
 * (#5501) handle cases where the visual size should differ from the heading level. Until
 * those ship, stay on EDS 1.0.
 *
 * Heading component for semantic headings (h1-h6).
 * Uses the design system's typography styles for headings.
 */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      lineHeight = 'squished',
      weight = 'normal',
      tracking = 'normal',
      debug,
      as,
      ...rest
    },
    ref,
  ) => {
    return (
      <TypographyNext
        ref={ref}
        as={as}
        family="header"
        baseline="grid"
        size={getHeadingSize(as)}
        lineHeight={lineHeight}
        weight={weight}
        tracking={tracking}
        debug={debug}
        {...rest}
      />
    )
  },
)

Heading.displayName = 'Heading'
