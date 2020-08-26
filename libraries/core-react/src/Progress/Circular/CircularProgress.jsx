// @ts-nocheck
import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css, keyframes } from 'styled-components'
import { progress as tokens } from '../Progress.tokens'

const indeterminate = keyframes`
    100% {
      transform: rotate(360deg);
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

const BaseCircle = styled.circle`
  stroke: ${tokens.linear.background};
`

const ProgressCircle = styled.circle`
  stroke: ${tokens.linear.overlay};
`

const CircularProgress = forwardRef(function CircularProgress(
  { variant, className, value, ...props },
  ref,
) {
  const thickness = 4
  const progress = Math.round(value)
  const circleStyle = {}

  const rootProps = {
    ...props,
    ref,
    variant,
  }

  const circumference = 2 * Math.PI * ((48 - thickness) / 2)

  if (variant === 'determinate') {
    circleStyle.stroke = circumference.toFixed(3)
    circleStyle.strokeDashoffset = `${(
      ((100 - progress) / 100) *
      circumference
    ).toFixed(3)}px`

    rootProps['aria-valuenow'] = progress

    if (value !== undefined) {
      rootProps['aria-valuenow'] = progress
      rootProps['aria-valuemin'] = 0
      rootProps['aria-valuemax'] = 100
    }
  }

  return (
    <ProgressRoot
      {...rootProps}
      role="progressbar"
      className={`${className} ${variant}-progress`}
    >
      <svg viewBox="24 24 48 48">
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
      </svg>
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
