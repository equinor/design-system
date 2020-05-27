import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { progress as tokens } from './Progress.tokens'


const CircularProgress = forwardRef(function CircularProgress(
  { children, variant, className, ...props },
  ref,
) {
  return (
  )
})

CircularProgress.displayName = 'eds-circular-progress'

CircularProgress.propTypes = {
  /** @ignore */
  children: PropTypes.node.isRequired,
  /** @ignore */
  className: PropTypes.string,
  /** Variant */
  variant: PropTypes.oneOf(['bullet', 'numbered']),
}

CircularProgress.defaultProps = {
  className: '',
  variant: 'bullet',
  start: undefined,
}

export { CircularProgress }
