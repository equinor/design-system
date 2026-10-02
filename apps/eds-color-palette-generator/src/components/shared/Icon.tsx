import { useId } from 'react'
import type { IconData } from '@equinor/eds-icons'

export type IconSize = 16 | 18 | 24

export type IconProps = {
  /** Icon data from `@equinor/eds-icons`, e.g. `add` or `close` */
  data: IconData
  /** Rendered width and height in pixels */
  size?: IconSize
  /**
   * Accessible name. With a title the icon is announced (`role="img"`);
   * without one it is decorative and hidden from assistive technology.
   */
  title?: string
  className?: string
}

/** An EDS icon drawn in the current text colour. */
export function Icon({ data, size = 18, title, className }: IconProps) {
  const titleId = useId()
  const paths = Array.isArray(data.svgPathData)
    ? data.svgPathData
    : [data.svgPathData]

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${data.width} ${data.height}`}
      width={size}
      height={size}
      fill="currentColor"
      className={['shrink-0', className].filter(Boolean).join(' ')}
      {...(title
        ? { role: 'img', 'aria-labelledby': titleId }
        : { 'aria-hidden': true, focusable: false })}
    >
      {title && <title id={titleId}>{title}</title>}
      {paths.map((d) => (
        <path key={d} d={d} fillRule="evenodd" clipRule="evenodd" />
      ))}
    </svg>
  )
}
