import { forwardRef } from 'react'
import { ParagraphProps } from './Paragraph.types'
import { TypographyNext } from './Typography.new'

/**
 * @deprecated Use CSS-first typography instead. Import
 * `@equinor/eds-core-react/next/index.css` and use plain `p` tags inside
 * a `.eds-elements` container — sizing, weight, and flow spacing come from
 * the stylesheet with no wrapper component needed.
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
