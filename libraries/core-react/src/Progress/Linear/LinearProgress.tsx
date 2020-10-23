import React, { forwardRef } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { progress as tokens } from '../Progress.tokens'
import CSS from 'csstype'

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

const ProgressRoot = styled.div`
  position: relative;
  overflow: hidden;
  height: 4px;
  background-color: ${tokens.linear.background};
  width: 100%;
  border-radius: 50px;
`
type ProgressBarProps = {
  variant: 'indeterminate' | 'determinate'
}

const ProgressBar = styled.div<ProgressBarProps>`
  ${({ variant }) =>
    variant === 'determinate' &&
    css`
      transition: transform 0.4s linear;
      background-color: ${tokens.linear.overlay};
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
const IndeterminateProgress = styled.div`
  width: 75%;
  border-radius: 50px;
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0;
  transition: transform 0.2s linear;
  transform-origin: left;
  background-color: ${tokens.linear.overlay};
  animation: ${indeterminate} 1.5s cubic-bezier(0.165, 0.84, 0.44, 1) 1s
    infinite;
`

type Props = {
  /* Variant
   * Use indeterminate when there is no progress value */
  variant?: 'indeterminate' | 'determinate'
  /* The value of the progress indicator for determinate variant
   * Value between 0 and 100 */
  value?: number
  className?: string
}

const LinearProgress = forwardRef<HTMLDivElement, Props>(
  function LinearProgress(
    { variant = 'indeterminate', className = '', value = null, ...props },
    ref,
  ) {
    const rootProps = {
      ...props,
      ref,
    }
    let barStyle: string
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
    }

    const transformStyle: CSS.Properties = {
      transform: barStyle,
    }

    return (
      <ProgressRoot
        {...rootProps}
        role="progressbar"
        className={`${className} ${variant}-progress`}
      >
        <ProgressBar {...progressProps} style={transformStyle} />
        {variant === 'indeterminate' && <IndeterminateProgress />}
      </ProgressRoot>
    )
  },
)

// LinearProgress.displayName = 'eds-linear-progress'

export { LinearProgress }
