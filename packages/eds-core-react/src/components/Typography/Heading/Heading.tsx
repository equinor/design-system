import { forwardRef, ElementType } from 'react'
import { TypographyProps } from '../typography.types'
import { Typography } from '../_components/Typography'
import { OverridableComponent } from '@equinor/eds-utils'

export type HeadingProps = TypographyProps & {
  /** "as" is required in Heading due to the a11y importance of using the correct level */
  as: ElementType
}

const EQUINOR_VERTICAL_OFFSET = 0.06

export const Heading: OverridableComponent<HeadingProps, HTMLElement> =
  forwardRef(function Heading(
    {
      size = 'md',
      lineHeight = 'default',
      fontWeight = 'normal',
      letterSpacing = 'normal',
      as,
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <Typography
        ref={ref}
        $lineHeight={lineHeight}
        $type={'header'}
        $size={size}
        $offset={EQUINOR_VERTICAL_OFFSET}
        $fontWeight={fontWeight}
        $letterSpacing={letterSpacing}
        as={as}
        {...rest}
      >
        {children}
      </Typography>
    )
  })
