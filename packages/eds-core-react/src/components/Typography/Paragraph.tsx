import { forwardRef } from 'react'
import { ParagraphProps } from './Paragraph.types'
import { TypographyNext } from './Typography.new'

/**
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
        ref={ref as React.Ref<HTMLParagraphElement>}
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
