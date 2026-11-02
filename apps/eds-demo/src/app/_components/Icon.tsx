import type { IconData } from '@equinor/eds-icons'

type IconProps = {
  data: IconData
  className?: string
}

/** Decorative icon from @equinor/eds-icons. The size and colour come from
 * the CSS: the icon fills its box and draws in currentColor. */
export function Icon({ data, className }: IconProps) {
  const paths = Array.isArray(data.svgPathData)
    ? data.svgPathData
    : [data.svgPathData]

  return (
    <svg
      className={className}
      viewBox={`0 0 ${data.width} ${data.height}`}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {paths.map((path) => (
        <path key={path} fillRule="evenodd" clipRule="evenodd" d={path} />
      ))}
    </svg>
  )
}
