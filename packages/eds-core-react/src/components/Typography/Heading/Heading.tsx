import { forwardRef, ElementType } from 'react'
import { TypographyProps } from '../typography.types'
import { Typography } from '../_components/Typography'
import { headingTokens as tokens } from '../_typography.tokens'
import { DEFAULT_TEXT_SIZE } from '../_defaults'
import { getTypographyProperties } from '../typography.utils'
import { OverridableComponent } from '@equinor/eds-utils'

export type HeadingProps = TypographyProps & {
  /** as is required in Heading due to the a11y importance of using the correct level */
  as: ElementType
}

export const Heading: OverridableComponent<HeadingProps, HTMLElement> =
  forwardRef(function Heading(
    { size = DEFAULT_TEXT_SIZE, as, children, ...rest },
    ref,
  ) {
    const {
      fontFamily,
      fontSizeInRem: fontSize,
      lineHeightInRem: lineHeight,
      verticalOffset,
    } = getTypographyProperties({ size, tokens })

    return (
      <Typography
        ref={ref}
        as={as}
        $fontSize={fontSize}
        $lineHeight={lineHeight}
        $fontFamily={fontFamily}
        $offset={verticalOffset}
        {...rest}
      >
        {children}
      </Typography>
    )
  })
