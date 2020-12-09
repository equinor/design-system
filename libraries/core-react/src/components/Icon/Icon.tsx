import * as React from 'react'
import { forwardRef, Ref, SVGProps } from 'react'
import styled from 'styled-components'
import { get } from './library'
import type { IconData } from '@equinor/eds-icons'
import type { IconBasket, Name } from './Icon.types'

type StyledProps = {
  height: number
  width: number
  fill: string
  size?: number
  rotation?: number
}

type SvgProps = {
  name: string
  viewBox: string
  className: string
  rotation?: number
  title?: string
  role?: string
  'aria-hidden'?: boolean | 'true' | 'false'
  'aria-labelledby'?: string
}

const customIcon = (icon: IconData): IconBasket => ({
  icon,
  count: Math.floor(Math.random() * 1000),
})

const transform = ({ rotation }: SvgProps): string =>
  rotation ? `transform: rotate(${rotation}deg)` : ''

const StyledSvg = styled.svg.attrs<StyledProps>(({ height, width, fill }) => ({
  name: null,
  xmlns: 'http://www.w3.org/2000/svg',
  height: `${height}px`,
  width: `${width}px`,
  fill,
}))`
  ${transform}
`

const StyledPath = styled.path.attrs<StyledProps>(({ height, size }) => ({
  size: null,
  fillRule: 'evenodd',
  clipRule: 'evenodd',
  transform: size / height !== 1 ? `scale(${size / height})` : null,
}))``

export type IconProps = {
  /** Title for icon when used semantically */
  title?: string
  /** Color */
  color?: string
  /** Size */
  size?: 16 | 24 | 32 | 40 | 48
  /** Rotation */
  rotation?: 0 | 90 | 180 | 270
  /** Name */
  name?: Name
  /** Manually specify which icon data to use */
  data?: IconData
  /** @ignore */
  ref?: Ref<SVGSVGElement>
} & SVGProps<SVGSVGElement>

export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  {
    size = 24,
    color = 'currentColor',
    name,
    className,
    rotation,
    title,
    data,
    ...rest
  },
  ref,
) {
  const { icon, count }: IconBasket = data ? customIcon(data) : get(name)

  if (typeof icon === 'undefined') {
    throw Error(
      `Icon "${name}" not found. Have you added it using Icon.add() or using data props?`,
    )
  }

  let svgProps: SvgProps & StyledProps = {
    height: size,
    width: size,
    fill: color,
    viewBox: `0 0 ${size} ${size}`,
    className,
    rotation,
    name,
    'aria-hidden': true,
    title: null,
  }

  const pathProps = {
    d: icon.svgPathData,
    height: icon.height ? icon.height : size,
    size,
  }

  // Accessibility
  let titleId = ''

  if (title) {
    titleId = `${icon.prefix}-${icon.name}-${count}`
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
      <StyledPath data-testid="eds-icon-path" {...pathProps} />
    </StyledSvg>
  )
})

// Icon.displayName = 'EdsIcon'
