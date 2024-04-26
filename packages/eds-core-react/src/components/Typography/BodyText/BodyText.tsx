import { forwardRef } from 'react'
import { bodyTextTokens as tokens } from '../_typography.tokens'
import { Typography } from '../_components/Typography'
import { TypographyProps } from '../typography.types'
import { DEFAULT_TEXT_ELEMENT, DEFAULT_TEXT_SIZE } from '../_defaults'
import { getTypographyProperties } from '../typography.utils'
import { OverridableComponent } from '@equinor/eds-utils'

export type BodyTextProps = TypographyProps

export const BodyText: OverridableComponent<BodyTextProps, HTMLElement> =
  forwardRef(function BodyText(
    { size = DEFAULT_TEXT_SIZE, as = DEFAULT_TEXT_ELEMENT, children, ...rest },
    ref,
  ) {
    const {
      fontFamily,
      fontSizeInRem: fontSize,
      lineHeightInRem: lineHeight,
      verticalOffset,
    } = getTypographyProperties({ size, tokens })

    //@todo: optional color prop to set primary/secondary/tertiary text? (default should be  inherit)
    return (
      <Typography
        ref={ref}
        as={as}
        $fontSize={fontSize}
        $lineHeight={lineHeight}
        $fontFamily={fontFamily}
        $offset={verticalOffset}
        $onGrid={true}
        {...rest}
      >
        {children}
      </Typography>
    )
  })
