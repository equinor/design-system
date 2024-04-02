import { forwardRef } from 'react'
import { BaselineGrid } from '../_components/BaselineGrid'
import { getTypographyProperties } from '../typography.utils'
import { UITextProps } from '../typography.types'
import { uiTextTokens } from '../_typography.tokens'
import { Typography } from '../_components/Typography'

export const UIText = forwardRef<HTMLElement, UITextProps>(
  function UIText(props, ref) {
    const size = props.size || 'BASE'
    const element = props.as ?? 'p'

    const { fontSize, lineHeight, fontFamily, color, trimValues } =
      getTypographyProperties({
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
        $trimValues={trimValues}
      >
        {props.children}
      </Typography>
    )

    if (props.isGridVisible) return <BaselineGrid>{component}</BaselineGrid>

    return component
  },
)
