import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { progress as tokens } from './Progress.tokens'

const ProgressRoot = styled.div`
  position: relative;
  overflow: hidden;
  height: 4;
`

const ProgressBar = styled.div`
  width: '100%';
  position: 'absolute';
  left: 0;
  bottom: 0;
  top: 0;
  transition: 'transform 0.2s linear';
  transform-origin: 'left';
`
const IndeterminateProgress = styled(ProgressBar)``

const LinearProgress = forwardRef(function LinearProgress(
  { children, variant, className, value, ...props },
  ref,
) {
  const rootProps = {}
  const inlineStyles = { bar1: {}, bar2: {} }
  if (variant === 'determinate') {
    if (value !== undefined) {
      rootProps['aria-valuenow'] = Math.round(value)
      let transform = value - 100

      inlineStyles.bar1.transform = `translateX(${transform}%)`
    }
  }

  return (
    <ProgressRoot {...rootProps}>
      <ProgressBar />
      {variant === 'indeterminate' && <IndeterminateProgress />}
    </ProgressRoot>
  )
})

LinearProgress.displayName = 'eds-linear-progress'

LinearProgress.propTypes = {
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

LinearProgress.defaultProps = {
  className: '',
  variant: 'indeterminate',
  value: null,
}

export { LinearProgress }
