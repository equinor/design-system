import { forwardRef } from 'react'
import { TypographyProps } from '../typography.types'
import { Typography } from '../_components/Typography'
import { uiTextTokens as tokens } from '../_typography.tokens'
import { DEFAULT_TEXT_SIZE, DEFAULT_TEXT_ELEMENT } from '../_defaults'
import { getTypographyProperties } from '../typography.utils'
import { OverridableComponent } from '@equinor/eds-utils'

export type UITextProps = TypographyProps & {
  /** When true, text is pushed to the bottom of its text-box (making it "on grid" as the total heigth is rounded to a multiple of 4px), when false it is centered within the text-box
   * @default false
   */
  onGrid?: boolean
}

export const UIText: OverridableComponent<UITextProps, HTMLElement> =
  forwardRef(function UIText(
    {
      size = DEFAULT_TEXT_SIZE,
      as = DEFAULT_TEXT_ELEMENT,
      onGrid = false,
      children,
      ...rest
    },
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
        $onGrid={onGrid}
        {...rest}
      >
        {children}
      </Typography>
    )
  })
