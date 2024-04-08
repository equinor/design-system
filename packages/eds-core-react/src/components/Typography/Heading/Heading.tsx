import { forwardRef, memo } from 'react'
import { HeadingProps } from '../typography.types'
import { Typography } from '../_components/Typography'
import { headingTokens as tokens } from '../_typography.tokens'
import { DEFAULT_HEADING_ELEMENT, DEFAULT_TEXT_SIZE } from '../_defaults'
import { getTypographyProperties } from '../typography.utils'

export const Heading = memo(
  forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
    {
      size = DEFAULT_TEXT_SIZE,
      as = DEFAULT_HEADING_ELEMENT,
      children,
      ...rest
    },
    ref,
  ) {
    const {
      baselineTrimGridInEm: baselineTrim,
      capHeightTrimInEm: capHeightTrim,
      fontFamily,
      fontSizeInRem: fontSize,
      lineHeightInRem: lineHeight,
    } = getTypographyProperties({ size, tokens })

    return (
      <Typography
        ref={ref}
        as={as}
        $fontSize={fontSize}
        $lineHeight={lineHeight}
        $fontFamily={fontFamily}
        $capHeightTrim={capHeightTrim}
        $baselineTrim={baselineTrim}
        {...rest}
      >
        {children}
      </Typography>
    )
  }),
)
