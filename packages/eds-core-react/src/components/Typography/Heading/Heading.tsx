import { forwardRef } from 'react'
import { BaselineGrid } from '../_components/BaselineGrid'
import { getTypographyProperties } from '../typography.utils'
import { HeadingProps } from '../typography.types'
import { headingTokens } from '../_typography.tokens'
import { Typography } from '../_components/Typography'

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  function Heading(props, ref) {
    const size = props.size || 'BASE'
    const element = props.as ?? 'h1'

    const {
      fontSize,
      lineHeight,
      fontFamily,
      color,
      capHeightTrim,
      baselineTrim,
    } = getTypographyProperties({
      size,
      tokens: headingTokens,
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
        $baselineTrim={baselineTrim}
      >
        {props.children}
      </Typography>
    )

    if (props.isGridVisible) return <BaselineGrid>{component}</BaselineGrid>

    return component
  },
)
