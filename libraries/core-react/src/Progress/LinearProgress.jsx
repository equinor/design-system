import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css, keyframes } from 'styled-components'
import { progress as tokens } from './Progress.tokens'

const indeterminate1 = keyframes`
  0% {
        left: -35%;
        right: 100%;
      }

      60% {
        left: 100%;
        right: -90%;
      }
      100% {
        left: 100%;
        right: -90%;
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
  position: relative;
  overflow: hidden;
  height: 4px;
  background-color: ${tokens.linear.background};
  width: 100%;
`

const ProgressBar = styled.div`
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

const LinearProgress = forwardRef(function LinearProgress(
  { children, variant, className, value, ...props },
  ref,
) {
  const rootProps = {}
  let barStyle
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
    transform: barStyle,
  }

  return (
    <ProgressRoot {...rootProps} role="progressbar">
      <ProgressBar className="progressBar" {...progressProps} />
      {variant === 'indeterminate' && (
        <IndeterminateProgress className="indeterminate" />
      )}
    </ProgressRoot>
  )
})

LinearProgress.displayName = 'eds-linear-progress'

LinearProgress.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /* Variant
   * Use indeterminate when there is no progress value */
  variant: PropTypes.oneOf(['determinate', 'indeterminate']),
  /* The value of the progress indicator for determinate variant
   * Value between 0 and 100 */
  value: PropTypes.number,
}

LinearProgress.defaultProps = {
  className: '',
  variant: 'indeterminate',
  value: null,
}

export { LinearProgress }
