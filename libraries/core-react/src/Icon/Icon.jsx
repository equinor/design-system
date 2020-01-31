import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { get } from './library'

const transform = ({ rotation }) =>
  rotation ? `transform: rotate(${rotation}deg)` : null
const StyledSvg = styled.svg.attrs(({ height, width, fill }) => ({
  xmlns: 'http://www.w3.org/2000/svg',
  height,
  width,
  fill,
}))`
  ${transform}
`

const StyledPath = styled.path.attrs(({ icon, size }) => ({
  fillRule: 'evenodd',
  clipRule: 'evenodd',
  d: icon.svgPathData,
  transform: size / icon.height !== 1 ? `scale(${size / icon.height})` : null,
}))``

export const Icon = forwardRef(function EdsIcon(
  { size, color, name, className, rotation, title, ...rest },
  ref,
) {
  const { icon, count } = get(name)

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
      <StyledPath data-testid="eds-icon-path" {...iconProps} />
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
  size: PropTypes.oneOf([16, 24, 32, 40, 48]),
  // Rotation
  rotation: PropTypes.oneOf([0, 90, 180, 270]),
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
