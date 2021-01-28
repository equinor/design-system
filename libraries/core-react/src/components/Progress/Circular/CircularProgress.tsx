import * as React from 'react'
import { forwardRef, HTMLAttributes } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { progress as tokens } from '../Progress.tokens'
import type { CSSObject } from 'styled-components'

const indeterminate = keyframes`
    100% {
      transform: rotate(360deg);
    }
`
type ProgressRootProps = { size: number } & Pick<
  CircularProgressProps,
  'variant'
>

const ProgressRoot = styled.div<ProgressRootProps>`
  display: inline-block;
  ${({ size }) => css`
    height: ${size}px;
    width: ${size}px;
  `}
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

export type CircularProgressProps = {
  /**  Use indeterminate when there is no progress value */
  variant?: 'determinate' | 'indeterminate'
  /** @ignore */
  className?: string
  /**  The value of the progress indicator for determinate variant.
   * Value between 0 and 100 */
  value?: number
  /** Size */
  size?: 16 | 24 | 32 | 40 | 48
} & HTMLAttributes<HTMLDivElement>

const CircularProgress = forwardRef<HTMLDivElement, CircularProgressProps>(
  function CircularProgress(
    {
      variant = 'indeterminate',
      className = '',
      value = null,
      size = 48,
      ...props
    },
    ref,
  ) {
    const thickness = 4
    const progress = Math.round(value)
    const circleStyle: CSSObject = {}

    const rootProps = {
      ...props,
      ref,
      variant,
    }

    const circumference = 2 * Math.PI * ((size - thickness) / 2)

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

    const viewBoxXY = size / 2

    return (
      <ProgressRoot
        {...rootProps}
        role="progressbar"
        className={`${className} ${variant}-progress`}
        size={size}
      >
        <svg viewBox={`${viewBoxXY} ${viewBoxXY} ${size} ${size}`}>
          <BaseCircle
            style={circleStyle}
            cx={size}
            cy={size}
            r={(size - thickness) / 2}
            fill="none"
            strokeWidth={thickness}
          />
          <ProgressCircle
            style={circleStyle}
            cx={size}
            cy={size}
            r={(size - thickness) / 2}
            fill="none"
            strokeLinecap="round"
            strokeWidth={thickness}
            strokeDasharray={variant === 'determinate' ? circumference : size}
          />
        </svg>
      </ProgressRoot>
    )
  },
)

// CircularProgress.displayName = 'eds-circular-progress'

export { CircularProgress }
