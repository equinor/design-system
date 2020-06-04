import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css, keyframes } from 'styled-components'
import { progress as tokens } from './Progress.tokens'

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
    variant === 'indeterminate'
      ? css`
          animation: ${indeterminate} 1.4s linear infinite;
        `
      : css`
          transform: rotate(-90deg);
        `};
`
const StyledSvg = styled.svg`
  display: block;
`

const BaseCircle = styled.circle`
  stroke: ${tokens.linear.background};
`

const ProgressCircle = styled.circle`
  stroke: ${tokens.linear.overlay};
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
  const rootProps = {
    variant,
  }
  const circleStyle = {}
  const circumference = 2 * Math.PI * ((48 - thickness) / 2)
  if (variant === 'determinate') {
    circleStyle.stroke = circumference.toFixed(3)
    circleStyle.strokeDashoffset = `${(
      ((100 - value) / 100) *
      circumference
    ).toFixed(3)}px`
    rootProps['aria-valuenow'] = Math.round(value)
    if (value !== undefined) {
      rootProps['aria-valuenow'] = Math.round(value)
      rootProps['aria-valuemin'] = 0
      rootProps['aria-valuemax'] = 100
    }
  }

  return (
    <ProgressRoot {...rootProps} role="progressbar">
      <StyledSvg viewBox="24 24 48 48">
        <BaseCircle
          style={circleStyle}
          cx={48}
          cy={48}
          r={(48 - thickness) / 2}
          fill="none"
          strokeWidth={thickness}
        />
        <ProgressCircle
          style={circleStyle}
          cx={48}
          cy={48}
          r={(48 - thickness) / 2}
          fill="none"
          strokeLinecap="round"
          strokeWidth={thickness}
          strokeDasharray={variant === 'determinate' ? circumference : 48}
        />
      </StyledSvg>
    </ProgressRoot>
  )
})

CircularProgress.displayName = 'eds-circular-progress'

CircularProgress.propTypes = {
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
