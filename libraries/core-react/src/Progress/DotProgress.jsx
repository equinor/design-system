import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css, keyframes } from 'styled-components'
import { progress as tokens } from './Progress.tokens'

const opacity = keyframes`
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0.5;
    }
`

const Svg = styled.svg`
  fill: ${({ color }) => color};
  circle {
    &:nth-child(1) {
      animation: ${opacity} 1s ease infinite;
    }
    &:nth-child(2) {
      animation: ${opacity} 1s ease 0.2s infinite;
    }
    &:nth-child(3) {
      animation: ${opacity} 1s ease 0.4s infinite;
    }
  }
`

const DotWrapper = styled.div`
  display: flex;
  justify-items: space-between;
`

const Dot = styled.circle`
  height: 8px;
  width: 8px;
  border-radius: 50%;
  /* animation: ${opacity} 1s infinite; */
`

const DotProgress = forwardRef(function DotProgress(
  { children, variant, className, value, ...props },
  ref,
) {
  const rootProps = {}
  let barStyle
  if (variant === 'determinate') {
    if (value !== undefined) {
      rootProps['aria-valuenow'] = Math.round(value)
      rootProps['aria-valuemin'] = 0
      rootProps['aria-valuemax'] = 100
      const transform = value - 100

      barStyle = `translateX(${transform}%)`
    }
  }

  const progressProps = {
    variant,
    transform: barStyle,
  }

  const svgProps = {
    color: tokens.dots[variant].color,
  }

  return (
    <Svg {...svgProps} viewBox="0 0 16 4" height="8px" width="32px">
      <Dot cx={2} cy={2} r={2} />
      <Dot cx={8} cy={2} r={2} />
      <Dot cx={14} cy={2} r={2} />
    </Svg>
  )
})

DotProgress.displayName = 'eds-dot-progress'

DotProgress.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /* Variant
   * Choose between two colors */
  variant: PropTypes.oneOf(['white', 'green']),
}

DotProgress.defaultProps = {
  className: '',
  variant: 'white',
}

export { DotProgress }
