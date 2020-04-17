import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { slider as tokens } from './Slider.tokens'

const StyledSlider = styled.div``

export const Slider = forwardRef(function EdsSlider({ ...rest }, ref) {
  return (
    <StyledSlider {...rest} ref={ref}>
      Hello world
    </StyledSlider>
  )
})

Slider.displayName = 'eds-Slider'

Slider.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node,
  /** Function to handle closing scrim */
  onClose: PropTypes.func,
  /** Whether scrim can be dismissed with esc key */
  isDismissable: PropTypes.bool,
}

Slider.defaultProps = {
  className: '',
}
