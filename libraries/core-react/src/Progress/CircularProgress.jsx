import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css, keyframes } from 'styled-components'
import { progress as tokens } from './Progress.tokens'
import { cake } from '@equinor/eds-icons'

function getRelativeValue(value, min, max) {
  return (Math.min(Math.max(min, value), max) - min) / (max - min)
}

function easeOut(t) {
  t = getRelativeValue(t, 0, 1)
  // https://gist.github.com/gre/1650294
  t = (t -= 1) * t * t + 1
  return t
}

function easeIn(t) {
  return t * t
}

const indeterminate = keyframes`
  0% {
      transformOrigin: 50% 50%;
    }
    100% {
      transform: rotate(360deg);
    }
`
const indeterminate2 = keyframes`
   0%{
        left: -200%;
        right: 100%;
      }
      60% {
        left: 107%;
        right: -8%;
      }

      100% {
        left: 107%;
        right: -8%;
      }
    
`

const ProgressRoot = styled.div`
  display: inline-block;
  height: 48px;
  width: 48px;
  color: ${tokens.linear.background};
  ${({ variant }) =>
    variant === 'indeterminate' &&
    css`
      animation: ${indeterminate} 1.4s linear infinite;
    `};
`
const StyledSvg = styled.svg`
  display: block;
`

const StyledCircle = styled.circle`
  stroke: ${tokens.linear.overlay};
`

const ProgressCircle = styled.div`
  ${({ variant }) =>
    variant === 'indeterminate'
      ? css`
          width: auto;
          animation: ${indeterminate1} 2.1s
            cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
        `
      : css`
          transition: transform 0.4s linear;
          background-color: ${tokens.linear.overlay};
        `}
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0;
  transition: transform 0.2s linear;
  transform-origin: left;
  ${(transform) => transform};
`
const IndeterminateProgress = styled.div`
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0;
  transition: transform 0.2s linear;
  transform-origin: left;
  background-color: ${tokens.linear.overlay};
  animation: ${indeterminate2} 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) 1.15s
    infinite;
`

const CircularProgress = forwardRef(function CircularProgress(
  { children, variant, className, value, ...props },
  ref,
) {
  const thickness = 4
  const rootProps = {}
  const circleStyle = {}
  let barStyle
  if (variant === 'determinate') {
    const circumference = 2 * Math.PI * ((48 - thickness) / 2)
    circleStyle.stroke = circumference.toFixed(3)
    rootProps['aria-valuenow'] = Math.round(value)
    circleStyle.strokeDashoffset = `${(
      easeIn((100 - value) / 100) * circumference
    ).toFixed(3)}px`
    rootStyle.transform = `rotate(${(easeOut(value / 70) * 270).toFixed(3)}deg)`

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

  return (
    <ProgressRoot {...rootProps} role="progressbar">
      <StyledSvg viewBox="24 24 48 48">
        <StyledCircle
          style={circleStyle}
          cx={48}
          cy={48}
          r={(48 - thickness) / 2}
          fill="none"
          strokeWidth={thickness}
        />
      </StyledSvg>
    </ProgressRoot>
  )
})

CircularProgress.displayName = 'eds-circular-progress'

CircularProgress.propTypes = {
  /** @ignore */
  children: PropTypes.node.isRequired,
  /** @ignore */
  className: PropTypes.string,
  /* Variant
   * Use indeterminate when there is no progress value */
  variant: PropTypes.oneOf(['determinate', 'indeterminate']),
  /* The value of the progress indicator for determinate variant
   * Value between 0 and 100 */
  value: PropTypes.number,
}

CircularProgress.defaultProps = {
  className: '',
  variant: 'indeterminate',
  value: null,
}

export { CircularProgress }
