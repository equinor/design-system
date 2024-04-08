import { forwardRef, memo } from 'react'
import { UITextProps } from '../typography.types'
import { uiTextTokens as tokens } from '../_typography.tokens'
import { Typography } from '../_components/Typography'
import { DEFAULT_TEXT_ELEMENT, DEFAULT_TEXT_SIZE } from '../_defaults'
import { getTypographyProperties } from '../typography.utils'

export const UIText = memo(
  forwardRef<HTMLElement, UITextProps>(function UIText(
    { size = DEFAULT_TEXT_SIZE, as = DEFAULT_TEXT_ELEMENT, children, ...rest },
    ref,
  ) {
    const {
      baselineTrimInEm: baselineTrim,
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
