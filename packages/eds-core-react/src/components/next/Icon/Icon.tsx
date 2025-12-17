import { forwardRef, useId } from 'react'
import type { IconProps } from './Icon.types'
import './icon.css'

/**
 * Icon component for EDS 2.0
 *
 * Features:
 * - Automatic sizing from parent's data-font-size via --eds-typography-icon-size
 * - Dynamic fallback sizing (1.5em) when no tokens are set
 * - Explicit size prop for standalone usage
 * - WCAG 2.1 AA accessible with optional title for semantic icons
 *
 * @example
 * ```tsx
 * import { Icon } from '@equinor/eds-core-react/next'
 * import { save } from '@equinor/eds-icons'
 *
 * // Auto-sized from parent's data-font-size
 * <div data-font-size="md">
 *   <Icon data={warning} /> Error message
 * </div>
 *
 * // Explicit size for standalone usage
 * <Icon data={save} size="lg" />
 *
 * // Semantic icon with accessible name
 * <Icon data={save} title="Save document" />
 * ```
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { data, title, color = 'currentColor', size, className, ...rest },
  ref,
) {
  const titleId = useId()

  if (!data) {
    console.error('Icon: data prop is required')
    return null
  }

  const { svgPathData, height = '24', width = '24' } = data

  const classes = ['icon', className].filter(Boolean).join(' ')

  // Accessibility: decorative icons are hidden, semantic icons have role="img"
  const accessibilityProps = title
    ? {
        role: 'img' as const,
        'aria-labelledby': titleId,
      }
    : {
        'aria-hidden': true as const,
      }

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      fill={color}
      className={classes}
      data-testid="eds-icon"
      data-icon-size={size}
      {...accessibilityProps}
      {...rest}
    >
      {title && <title id={titleId}>{title}</title>}
      {Array.isArray(svgPathData) ? (
        svgPathData.map((pathData) => (
          <path
            key={pathData}
            fillRule="evenodd"
            clipRule="evenodd"
            d={pathData}
          />
        ))
      ) : (
        <path fillRule="evenodd" clipRule="evenodd" d={svgPathData} />
      )}
    </svg>
  )
})
