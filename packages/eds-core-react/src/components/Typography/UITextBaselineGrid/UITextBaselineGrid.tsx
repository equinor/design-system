import { forwardRef } from 'react'
import { getTypographyProperties } from '../typography.utils'
import { UITextProps } from '../typography.types'
import { uiTextTokens } from '../_typography.tokens'
import { Typography } from '../_components/Typography'
import { DEFAULT_TEXT_ELEMENT, DEFAULT_TEXT_SIZE } from '../_defaults'

export const UITextBaselineGrid = forwardRef<HTMLElement, UITextProps>(
  function UITextBaselineGrid(
    { size = DEFAULT_TEXT_SIZE, as = DEFAULT_TEXT_ELEMENT, children, ...rest },
    ref,
  ) {
    const {
      baselineTrimGridInEm: baselineTrim,
      capHeightTrimInEm: capHeightTrim,
      color,
      fontFamily,
      fontSizeInRem: fontSize,
      lineHeightInRem: lineHeight,
    } = getTypographyProperties({
      size,
      tokens: uiTextTokens,
    })

    return (
      <Typography
        ref={ref}
        as={as}
        $fontSize={fontSize}
        $lineHeight={lineHeight}
        $fontFamily={fontFamily}
        $color={color}
        $capHeightTrim={capHeightTrim}
        $baselineTrim={baselineTrim}
        {...rest}
      >
        {children}
      </Typography>
    )
  },
)
