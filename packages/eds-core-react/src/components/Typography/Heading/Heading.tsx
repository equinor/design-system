import { forwardRef } from 'react'
import { getTypographyProperties } from '../typography.utils'
import { HeadingProps } from '../typography.types'
import { headingTokens } from '../_typography.tokens'
import { Typography } from '../_components/Typography'
import { DEFAULT_HEADING_ELEMENT, DEFAULT_TEXT_SIZE } from '../_defaults'

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  function Heading(
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
    } = getTypographyProperties({
      size,
      tokens: headingTokens,
    })

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
  },
)
