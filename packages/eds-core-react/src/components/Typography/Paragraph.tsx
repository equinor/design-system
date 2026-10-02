import { forwardRef } from 'react'
import { ParagraphProps } from './Paragraph.types'
import { TypographyNext } from './Typography.new'

/**
 * @deprecated Avoid new adoption. Supported for the 2.x line, so if you already use this
 * component you can stay where you are — there is no need to migrate until the replacement
 * is ready. A CSS-first replacement is in progress: a base element stylesheet (#5477) gives
 * `p` its default size and flow spacing, and utility classes (#5501) handle exceptions. New
 * code that needs typography now should use plain `p`, which is the markup #5477 will style.
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
