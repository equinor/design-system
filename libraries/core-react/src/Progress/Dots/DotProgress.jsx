import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import { progress as tokens } from '../Progress.tokens'

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

const DotProgress = forwardRef(function DotProgress(
  { variant, className, ...rest },
  ref,
) {
  const props = {
    color: tokens.dots[variant].color,
    ref,
    ...rest,
  }

  return (
    <Svg
      {...props}
      role="progressbar"
      className={`${className} ${variant}-progress`}
      viewBox="0 0 16 4"
      height="8px"
      width="32px"
    >
      <circle cx={2} cy={2} r={2} />
      <circle cx={8} cy={2} r={2} />
      <circle cx={14} cy={2} r={2} />
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
