import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { get } from './library'

const StyledSvg = styled.svg(({ height, width, rotation, fill }) => ({
  xmlns: 'http://www.w3.org/2000/svg',
  transform: rotation ? `rotate(${rotation}deg)` : null,
  height,
  width,
  fill,
}))

const StyledPath = styled.path.attrs(({ icon, size }) => ({
  fillRule: 'evenodd',
  clipRule: 'evenodd',
  d: icon.svgPathData,
  transform: size / icon.height !== 1 ? `scale(${size / icon.height})` : null,
}))``

export const Icon = forwardRef(function EdsIcon(
  { size, color, name, className, rotation, title },
  ref,
) {
  const icon = get()[name]

  if (typeof icon === 'undefined') {
    throw Error(`Icon "${name}" not found. Have you added it using Icon.add()?`)
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

  const iconProps = {
    icon,
    size,
  }

  // Accessibility
  let titleId = ''

  if (title !== null) {
    titleId = `${icon.prefix}-${icon.name}`
    svgProps = {
      ...svgProps,
      title,
      role: 'img',
      'aria-hidden': null,
      'aria-labelledby': titleId,
    }
  }

  return (
    <StyledSvg {...svgProps} ref={ref}>
      {title && <title id={titleId}>{title}</title>}
      <StyledPath {...iconProps} />
    </StyledSvg>
  )
})

Icon.displayName = 'eds-icon'

Icon.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  // Title for svg if used semantically
  title: PropTypes.string,
  // Valid colors
  color: PropTypes.string,
  // Vertical spacing
  size: PropTypes.oneOf([8, 16, 24, 32, 40, 48]),
  // Rotation
  rotation: PropTypes.oneOf([90, 180, 270]),
  // Name
  name: PropTypes.string.isRequired,
}

Icon.defaultProps = {
  className: '',
  title: null,
  color: null,
  size: 24,
  rotation: null,
}
