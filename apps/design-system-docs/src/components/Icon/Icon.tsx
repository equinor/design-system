import { forwardRef, useId } from 'react'

import type { IconProps } from './Icon.types'

import './icon.css'

/**
 * Renders an `@equinor/eds-icons` `IconData` as an inline SVG. Dogfoods the EDS
 * icon set across the documentation site instead of hand-pasted SVG paths.
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { data, title, className, ...rest },
  ref,
) {
  const titleId = useId()

  if (!data) {
    console.error('Icon: data prop is required')
    return null
  }

  const paths = Array.isArray(data.svgPathData)
    ? data.svgPathData
    : [data.svgPathData]
  const classes = ['docs-icon', className].filter(Boolean).join(' ')

  return (
    <svg
      ref={ref}
      className={classes}
      viewBox={`0 0 ${data.width} ${data.height}`}
      width="1em"
      height="1em"
      fill="currentColor"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-labelledby={title ? titleId : undefined}
      {...rest}
    >
      {title && <title id={titleId}>{title}</title>}
      {paths.map((pathData) => (
        <path key={pathData} d={pathData} />
      ))}
    </svg>
  )
})

Icon.displayName = 'Icon'
