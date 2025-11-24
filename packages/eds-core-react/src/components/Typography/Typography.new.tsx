import { forwardRef } from 'react'
import { TypographyNextProps } from './Typography.new.types'

/**
 * TypographyNext component for flexible typography with baseline grid support.
 *
 * Provides full control over typography properties including family, size,
 * lineHeight, baseline alignment, weight, and tracking.
 *
 * **Display behavior:** Elements render as `display: block` by default for
 * text-box trimming and baseline grid alignment. Override with CSS if needed.
 *
 * @example
 * ```tsx
 * import { TypographyNext as Typography } from '@equinor/eds-core-react'
 *
 * <Typography
 *   family="ui"
 *   size="md"
 *   lineHeight="default"
 *   baseline="grid"
 *   weight="normal"
 *   tracking="normal"
 * >
 *   Text content (renders as block-level by default)
 * </Typography>
 *
 * <Typography
 *   as="h1"
 *   family="header"
 *   size="3xl"
 *   lineHeight="squished"
 *   baseline="grid"
 *   weight="bolder"
 *   tracking="tight"
 * >
 *   Page heading
 * </Typography>
 * ```
 */
export const TypographyNext = forwardRef<HTMLElement, TypographyNextProps>(
  (
    {
      as = 'span',
      family,
      size,
      baseline,
      lineHeight,
      weight,
      tracking,
      debug,
      ...rest
    },
    ref,
  ) => {
    const Component = as

    return (
      <Component
        ref={ref}
        data-font-family={family}
        data-font-size={size}
        data-baseline={baseline || undefined}
        data-line-height={lineHeight || undefined}
        data-font-weight={weight || undefined}
        data-tracking={tracking || undefined}
        data-debug={debug ? '' : undefined}
        {...rest}
      />
    )
  },
)

TypographyNext.displayName = 'TypographyNext'
