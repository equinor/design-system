import React, { forwardRef } from 'react'
import CSS from 'csstype'
import styled, { css, keyframes } from 'styled-components'
import { progress as tokens } from '../Progress.tokens'

const indeterminate = keyframes`
    100% {
      transform: rotate(360deg);
    }
`
type ProgressRootProps = {
  variant?: 'determinate' | 'indeterminate'
}

const ProgressRoot = styled.div<ProgressRootProps>`
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

type Props = {
  /* Use indeterminate when there is no progress value */
  variant?: 'determinate' | 'indeterminate'
  className?: string
  /* The value of the progress indicator for determinate variant
   * Value between 0 and 100 */
  value?: number
}

const CircularProgress = forwardRef<HTMLDivElement, Props>(
  function CircularProgress(
    { variant = 'indeterminate', className = '', value = null, ...props },
    ref,
  ) {
    const thickness = 4
    const progress = Math.round(value)
    const circleStyle: CSS.Properties = {}

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
  },
)

// CircularProgress.displayName = 'eds-circular-progress'

export { CircularProgress }
