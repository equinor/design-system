import { forwardRef } from 'react'
import { ParagraphProps } from './Paragraph.types'
import { TypographyNext } from './Typography.new'

/**
 * @deprecated Avoid new adoption — every new use has to be undone when the replacement
 * lands. The component still works. A CSS-first replacement is in progress: a base element
 * stylesheet (#5477) gives `p` its default size and flow spacing, and utility classes
 * (#5501) handle exceptions. Until those ship, stay on EDS 1.0.
 *
 * Paragraph component for rendering text paragraphs.
 * Uses the design system's typography styles for UI text.
 */
export const Paragraph = forwardRef<HTMLParagraphElement, ParagraphProps>(
  (
    {
      size = 'lg',
      lineHeight = 'default',
      weight = 'normal',
      tracking = 'normal',
      debug,
      ...rest
    },
    ref,
  ) => {
    return (
      <TypographyNext
        ref={ref}
        as="p"
        family="ui"
        baseline="grid"
        size={size}
        lineHeight={lineHeight}
        weight={weight}
        tracking={tracking}
        debug={debug}
        {...rest}
      />
    )
  },
)

Paragraph.displayName = 'Paragraph'
