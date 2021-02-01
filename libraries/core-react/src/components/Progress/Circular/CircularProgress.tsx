import * as React from 'react'
import { forwardRef, SVGProps, Ref } from 'react'
import styled, { css, keyframes } from 'styled-components'
import * as tokens from './CircularProgress.tokens'
import type { CircularProgressToken } from './CircularProgress.tokens'
import type { CSSObject } from 'styled-components'

const indeterminate = keyframes`
    100% {
      transform: rotate(360deg);
    }
`
type SvgProps = Pick<CircularProgressProps, 'variant'>

const Svg = styled.svg<SvgProps>`
  display: inline-block;
  ${({ variant }) =>
    variant === 'indeterminate'
      ? css`
          animation: ${indeterminate} 1.4s linear infinite;
        `
      : css`
          transform: rotate(-90deg);
        `};
`

const TrackCircle = styled.circle``

const ProgressCircle = styled.circle``

const getToken = (color: 'primary' | 'neutral'): CircularProgressToken => {
  if (tokens[color]) {
    return tokens[color]
  }

  return {
    background: 'transparent',
    entities: {
      progress: {
        background: color,
      },
    },
  }
}

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
  /** Color
   * @default primary */
  color?: 'primary' | 'neutral'
  /** @ignore */
  ref?: Ref<SVGSVGElement>
} & SVGProps<SVGSVGElement>

const CircularProgress = forwardRef<SVGSVGElement, CircularProgressProps>(
  function CircularProgress(
    {
      variant = 'indeterminate',
      value = null,
      size = 48,
      color = 'primary',
      ...rest
    },
    ref,
  ) {
    const thickness = 4
    const progress = Math.round(value)
    const trackStyle: CSSObject = {}
    const props = {
      ...rest,
      ref,
      variant,
    }
    const token = getToken(color)

    const circumference = 2 * Math.PI * ((48 - thickness) / 2)

    if (variant === 'determinate') {
      trackStyle.stroke = circumference.toFixed(3)
      trackStyle.strokeDashoffset = `${(
        ((100 - progress) / 100) *
        circumference
      ).toFixed(3)}px`

      props['aria-valuenow'] = progress

      if (value !== undefined) {
        props['aria-valuenow'] = progress
        props['aria-valuemin'] = 0
        props['aria-valuemax'] = 100
      }
    }

    return (
      <Svg
        {...props}
        viewBox="24 24 48 48"
        role="progressbar"
        height={size}
        width={size}
        preserveAspectRatio="xMidYMid meet"
      >
        <TrackCircle
          style={trackStyle}
          cx={48}
          cy={48}
          r={(48 - thickness) / 2}
          fill="none"
          strokeWidth={thickness}
          stroke={token.background}
        />
        <ProgressCircle
          style={trackStyle}
          cx={48}
          cy={48}
          r={(48 - thickness) / 2}
          fill="none"
          strokeLinecap="round"
          strokeWidth={thickness}
          strokeDasharray={variant === 'determinate' ? circumference : 48}
          stroke={token.entities.progress.background}
        />
      </Svg>
    )
  },
)

// CircularProgress.displayName = 'eds-circular-progress'

export { CircularProgress }
