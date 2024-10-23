import { forwardRef, ElementType } from 'react'
import { Typography } from '../_components/Typography'
import { TypographyProps, TypographyElement } from '../typography.types'
import { OverridableComponent } from '@equinor/eds-utils'

export type TextProps = TypographyProps & {
  /** When true, text is pushed to the bottom of its text-box (making it "on grid" as the total heigth is rounded to a multiple of 4px), when false it is centered within the text-box. Only works when variant is "ui"
   * @default false
   */
  onGrid?: boolean
  /** header: uses the "equinor" typeface. Please use the "as" prop to assign the correct header level when variant is header. Always "on grid"
   * body: uses "inter" typeface. Is always "on grid"
   * ui: uses inter typeface. For use in ui components such as buttons, tabs, chips etc. Unlocks "onGrid" prop which is false by default to center text vertically.
   * @default 'body'
   */
  variant?: 'ui' | 'body' | 'header'
  as?: ElementType
}
const INTER_VERTICAL_OFFSET = 0.002
const EQUINOR_VERTICAL_OFFSET = 0.06

export const Text: OverridableComponent<TextProps, HTMLElement> = forwardRef(
  function Text(
    {
      size = 'lg',
      lineHeight = 'default',
      fontWeight = 'normal',
      letterSpacing = 'normal',
      variant = 'body',
      lines,
      color,
      as,
      onGrid = false,
      children,
      ...rest
    },
    ref,
  ) {
    const variantType: TypographyElement =
      variant === 'header' ? variant : 'ui-body'
    const offset =
      variant === 'header' ? EQUINOR_VERTICAL_OFFSET : INTER_VERTICAL_OFFSET
    const gridOn = variant === 'ui' ? onGrid : true
    return (
      <Typography
        ref={ref}
        as={as}
        $color={color}
        $type={variantType}
        $offset={offset}
        $size={size}
        $lineHeight={lineHeight}
        $lines={lines}
        $fontWeight={fontWeight}
        $letterSpacing={letterSpacing}
        $onGrid={gridOn}
        {...rest}
      >
        {children}
      </Typography>
    )
  },
)
