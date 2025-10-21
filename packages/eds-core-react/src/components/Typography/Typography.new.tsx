import { forwardRef } from 'react'
import { TypographyNextProps } from './Typography.new.types'
import { buildClassName } from './typography-utils'

/**
 * TypographyNext component for flexible typography with baseline grid support.
 *
 * Provides full control over typography properties including family, size,
 * lineHeight, baseline alignment, weight, and tracking.
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
 *   Flexible inline text
 * </Typography>
 * ```
 */
export const TypographyNext = forwardRef<HTMLElement, TypographyNextProps>(
  (
    {
      family,
      size,
      baseline,
      lineHeight,
      weight,
      tracking,
      debug,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const Component = 'span'
    const combinedClassName = buildClassName({
      family,
      size,
      baseline,
      lineHeight,
      weight,
      tracking,
      className,
    })

    return (
      <Component
        ref={ref as React.Ref<HTMLSpanElement>}
        className={combinedClassName}
        data-debug={debug ? '' : undefined}
        {...rest}
      >
        {children}
      </Component>
    )
  },
)

TypographyNext.displayName = 'TypographyNext'
