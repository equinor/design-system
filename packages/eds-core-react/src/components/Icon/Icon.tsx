import type { IconData } from '@equinor/eds-icons'
import { useId } from '@equinor/eds-utils'
import { Ref, SVGProps, forwardRef } from 'react'
import styled from 'styled-components'
import type { Name } from './Icon.types'
import { get } from './library'

type StyledProps = {
  $height?: number
  $width: number
  fill: string
  size?: number
  $rotation?: number
}
type PathProps = {
  d: string
  $height: number
  $size: number
}

type SimpleSVGProps = {
  name: string
  viewBox: string
  $rotation?: number
  title?: string
  role?: string
  'aria-hidden'?: boolean | 'true' | 'false'
  'aria-labelledby'?: string
}

const StyledSvg = styled.svg.attrs<StyledProps>(
  ({ $height, $width, fill }) => ({
    name: null,
    xmlns: 'http://www.w3.org/2000/svg',
    height: `${$height}px`,
    width: `${$width}px`,
    fill,
  }),
)`
  transform: ${({ $rotation }) =>
    $rotation ? `rotate(${$rotation}deg)` : 'none'};
`

const StyledPath = styled.path.attrs<PathProps>(({ $height, $size }) => ({
  size: null,
  fillRule: 'evenodd',
  clipRule: 'evenodd',
  transform: $size / $height !== 1 ? `scale(${$size / $height})` : null,
}))``

const findIcon = (name: string, data: IconData, size: number) => {
  // eslint-disable-next-line prefer-const
  const icon = data ?? get(name)

  if (size < 24) {
    // fallback to normal icon if small is not made yet
    return icon.sizes?.small || icon
  }

  return icon
}

export type IconProps = (
  | {
      /** Title for icon when used semantically */
      title?: string
      /** Color */
      color?: string
      /** Size */
      size?: 16 | 18 | 24 | 32 | 40 | 48
      /** Rotation */
      rotation?: 0 | 90 | 180 | 270
      /** Name */
      name: Name
      /** Manually specify which icon data to use */
      data?: IconData
      /** @ignore */
      ref?: Ref<SVGSVGElement>
    }
  | {
      /** Title for icon when used semantically */
      title?: string
      /** Color */
      color?: string
      /** Size */
      size?: 16 | 18 | 24 | 32 | 40 | 48
      /** Rotation */
      rotation?: 0 | 90 | 180 | 270
      /** Name */
      name?: Name
      /** Manually specify which icon data to use */
      data: IconData
      /** @ignore */
      ref?: Ref<SVGSVGElement>
    }
) &
  SVGProps<SVGSVGElement>

export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { size, color = 'currentColor', name, rotation, title, data, ...rest },
  ref,
) {
  // eslint-disable-next-line prefer-const
  const icon = findIcon(name, data, size)

  if (typeof icon === 'undefined') {
    throw Error(
      `Icon "${name}" not found. Have you added it using Icon.add() or using data props?`,
    )
  }

  const $height = size ? size : parseInt(icon.width)
  const $width = size ? size : parseInt(icon.height)

  let svgProps: SimpleSVGProps & StyledProps = {
    $height,
    $width,
    fill: color,
    viewBox: `0 0 ${$width} ${$height}`,
    $rotation: rotation,
    name,
    'aria-hidden': true,
  }

  const pathProps = {
    $height: icon.height ? parseInt(icon.height) : size,
    $size: size || parseInt(icon.height),
  }

  // Accessibility
  const titleId = useId(`${icon.prefix}-${icon.name}`)
  if (title) {
    svgProps = {
      ...svgProps,
      title,
      role: 'img',
      'aria-hidden': undefined,
      'aria-labelledby': titleId,
    }
  }

  return (
    <StyledSvg {...svgProps} {...rest} ref={ref}>
      {title && <title id={titleId}>{title}</title>}
      {Array.isArray(icon.svgPathData) ? (
        icon.svgPathData.map((pathData) => {
          return <StyledPath key={pathData} {...pathProps} d={pathData} />
        })
      ) : (
        <StyledPath
          data-testid="eds-icon-path"
          {...pathProps}
          d={icon.svgPathData}
        />
      )}
    </StyledSvg>
  )
})

// Icon.displayName = 'EdsIcon'
