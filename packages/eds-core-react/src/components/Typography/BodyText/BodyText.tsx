import { forwardRef } from 'react'
import { Typography } from '../_components/Typography'
import { TypographyProps } from '../typography.types'
import { OverridableComponent } from '@equinor/eds-utils'

export type BodyTextProps = TypographyProps
const INTER_VERTICAL_OFFSET = 0.002

export const BodyText: OverridableComponent<BodyTextProps, HTMLElement> =
  forwardRef(function BodyText(
    {
      size = 'lg',
      lineHeight = 'default',
      fontWeight = 'normal',
      letterSpacing = 'normal',
      as = 'p',
      color,
      lines,
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <Typography
        ref={ref}
        as={as}
        $color={color}
        $type={'ui-body'}
        $offset={INTER_VERTICAL_OFFSET}
        $size={size}
        $lineHeight={lineHeight}
        $lines={lines}
        $fontWeight={fontWeight}
        $letterSpacing={letterSpacing}
        {...rest}
      >
        {children}
      </Typography>
    )
  })
