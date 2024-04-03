import { forwardRef } from 'react'
import { BaselineGrid } from '../_components/BaselineGrid'
import { getTypographyProperties } from '../typography.utils'
import { UITextProps } from '../typography.types'
import { uiTextTokens } from '../_typography.tokens'
import { Typography } from '../_components/Typography'

export const UITextBaselineGrid = forwardRef<HTMLElement, UITextProps>(
  function UIText(props, ref) {
    const size = props.size || 'BASE'
    const element = props.as ?? 'p'

    const {
      baselineTrimGrid,
      capHeightTrim,
      color,
      fontFamily,
      fontSize,
      lineHeight,
    } = getTypographyProperties({
      size,
      tokens: uiTextTokens,
    })

    const component = (
      <Typography
        ref={ref}
        as={element}
        $fontSize={fontSize}
        $lineHeight={lineHeight}
        $fontFamily={fontFamily}
        $color={color}
        $capHeightTrim={capHeightTrim}
        $baselineTrim={baselineTrimGrid}
      >
        {props.children}
      </Typography>
    )

    if (props.isGridVisible) return <BaselineGrid>{component}</BaselineGrid>

    return component
  },
)
