import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { get } from './library'

const px = (x) => `${x}px`

const StyledSvg = styled.svg.attrs(({ height, width }) => ({
  height: px(height),
  width: px(width),
  viewBox: `0 0 ${width} ${height}`,
  // ariahidden: true,
  // focusable: false,
}))`
  ${({ rotation }) => (rotation ? `transform: rotate(${rotation}deg);` : '')}
  ${({ fill }) => (fill ? `fill: ${fill};` : '')}
`

export const Icon = forwardRef(function EdsIcon(
  { size, color, name, className, rotation },
  ref,
) {
  const props = {
    height: size,
    width: size,
    fill: color,
    className,
    rotation,
    name,
  }
  const icon = get()[name]

  if (typeof icon === 'undefined') {
    throw Error(`Icon "${name}" not found. Have you added it using Icon.add()?`)
  }
  const scale = size / icon.height
  const transformPath = `scale(${scale})`

  return (
    <StyledSvg {...props} ref={ref}>
      <path
        transform={transformPath}
        d={icon.svgPathData}
        fillRule="evenodd"
        clipRule="evenodd"
      />
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
