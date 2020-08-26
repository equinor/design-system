// @ts-nocheck
import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { get } from './library'

const customIcon = (icon) => ({ icon, count: Math.floor(Math.random() * 1000) })

const transform = ({ rotation }) =>
  rotation ? `transform: rotate(${rotation}deg)` : null

const StyledSvg = styled.svg.attrs(({ height, width, fill }) => ({
  name: null,
  xmlns: 'http://www.w3.org/2000/svg',
  height,
  width,
  fill,
}))`
  ${transform}
`

const StyledPath = styled.path.attrs(({ height, size }) => ({
  size: null,
  fillRule: 'evenodd',
  clipRule: 'evenodd',
  transform: size / height !== 1 ? `scale(${size / height})` : null,
}))``

export const Icon = forwardRef(function EdsIcon(
  { size, color, name, className, rotation, title, data, ...rest },
  ref,
) {
  const { icon, count } = data !== null ? customIcon(data) : get(name)

  if (typeof icon === 'undefined') {
    throw Error(
      `Icon "${name}" not found. Have you added it using Icon.add() or using data props?`,
    )
  }

  let svgProps = {
    height: size,
    width: size,
    fill: color,
    viewBox: `0 0 ${size} ${size}`,
    className,
    rotation,
    name,
    'aria-hidden': true,
  }

  const pathProps = {
    d: icon.svgPathData ? icon.svgPathData : icon.d,
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
      'aria-hidden': null,
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

Icon.displayName = 'eds-icon'

Icon.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** Title for svg if used semantically */
  title: PropTypes.string,
  /** color */
  color: PropTypes.string,
  /** Size */
  size: PropTypes.oneOf([16, 24, 32, 40, 48]),
  /** Rotation */
  rotation: PropTypes.oneOf([0, 90, 180, 270]),
  /** Name */
  name: PropTypes.string,
  /** Manually specify which icon data to use*/
  data: PropTypes.object,
}

Icon.defaultProps = {
  className: '',
  title: null,
  color: 'currentColor',
  size: 24,
  rotation: null,
  data: null,
  name: '',
}
