import * as React from 'react'
import { forwardRef, HTMLAttributes, Ref } from 'react'
import styled, { css, keyframes } from 'styled-components'
import type { CSSObject } from 'styled-components'
import * as tokens from './LinearProgress.tokens'

const indeterminate = keyframes`
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

const Track = styled.div`
  position: relative;
  overflow: hidden;
  height: 4px;
  background-color: ${tokens.primary.background};
  width: 100%;
  border-radius: 50px;
`
type StyledProgressBarProps = {
  variant: 'indeterminate' | 'determinate'
}

const ProgressBar = styled.div<StyledProgressBarProps>`
  ${({ variant }) =>
    variant === 'determinate' &&
    css`
      transition: transform 0.4s linear;
      background-color: ${tokens.primary.entities.progress.background};
    `}
  width: 100%;
  border-radius: 50px;
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0;
  transition: transform 0.2s linear;
  transform-origin: left;
`
const IndeterminateProgressBar = styled.div`
  width: 75%;
  border-radius: 50px;
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0;
  transition: transform 0.2s linear;
  transform-origin: left;
  background-color: ${tokens.primary.entities.progress.background};
  animation: ${indeterminate} 1.5s cubic-bezier(0.165, 0.84, 0.44, 1) 1s
    infinite;
`

export type LinearProgressProps = {
  /** Variant
   * Use indeterminate when there is no progress value */
  variant?: 'indeterminate' | 'determinate'
  /** The value of the progress indicator for determinate variant
   * Value between 0 and 100 */
  value?: number
  /** @ignore */
  ref?: Ref<SVGSVGElement>
} & HTMLAttributes<HTMLDivElement>

const LinearProgress = forwardRef<HTMLDivElement, LinearProgressProps>(
  function LinearProgress(
    { variant = 'indeterminate', value = null, ...rest },
    ref,
  ) {
    const props = {
      ...rest,
      ref,
    }
    let barStyle: string
    if (variant === 'determinate') {
      if (value !== undefined) {
        props['aria-valuenow'] = Math.round(value)
        props['aria-valuemin'] = 0
        props['aria-valuemax'] = 100
        const transform = value - 100

        barStyle = `translateX(${transform}%)`
      }
    }

    const progressProps = {
      variant,
    }

    const transformStyle: CSSObject = {
      transform: barStyle,
    }

    return (
      <Track {...props} role="progressbar">
        <ProgressBar {...progressProps} style={transformStyle} />
        {variant === 'indeterminate' && <IndeterminateProgressBar />}
      </Track>
    )
  },
)

// LinearProgress.displayName = 'eds-linear-progress'

export { LinearProgress }
