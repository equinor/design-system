import {
  forwardRef,
  SVGProps,
  Ref,
  useEffect,
  useState,
  CSSProperties,
} from 'react'
import styled, { css, keyframes } from 'styled-components'
import * as tokens from './CircularProgress.tokens'
import type { CircularProgressToken } from './CircularProgress.tokens'

const indeterminate = keyframes`
    100% {
      transform: rotate(360deg);
    }
`
type SvgProps = { $variant: 'determinate' | 'indeterminate' }

const Svg = styled.svg<SvgProps>`
  display: inline-block;
  ${({ $variant }) =>
    $variant === 'indeterminate'
      ? css`
          animation: ${indeterminate} 1.4s linear infinite;
        `
      : css`
          transform: rotate(-90deg);
        `};
`

const SrOnlyOutput = styled.output`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
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
  /**  The value of the progress indicator for determinate variant.
   * Value between 0 and 100 */
  value?: number
  /** Size */
  size?: 16 | 24 | 32 | 40 | 48
  /** Color */
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
    const trackStyle: CSSProperties = {}
    const props = {
      ...rest,
      ref,
      $variant: variant,
    }
    const token = getToken(color)
    const [srProgress, setSrProgress] = useState(0)

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

    useEffect(() => {
      if (variant === 'indeterminate') return
      if (progress >= 25 && progress < 50) {
        setSrProgress(25)
      } else if (progress >= 50 && progress < 75) {
        setSrProgress(50)
      } else if (progress >= 75 && progress < 100) {
        setSrProgress(75)
      } else if (progress === 100) {
        setSrProgress(100)
      }
    }, [progress, variant])

    const getProgressFormatted = () => {
      return `Loading ${srProgress}%`
    }

    return (
      <>
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
        {variant === 'determinate' && (
          <SrOnlyOutput>{getProgressFormatted()}</SrOnlyOutput>
        )}
      </>
    )
  },
)

// CircularProgress.displayName = 'eds-circular-progress'

export { CircularProgress }
