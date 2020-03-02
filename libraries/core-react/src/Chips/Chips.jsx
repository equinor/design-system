import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { chips as tokens } from './Chips.tokens'

const StyledChips = styled.div``

export const Chips = forwardRef(function Chips({ className, ...props }, ref) {
  return <StyledChips {...props} className={className} ref={ref} />
})

Chips.displayName = 'eds-chips'

Chips.propTypes = {
  /** @ignore */
  className: PropTypes.string,
}

Chips.defaultProps = {
  className: '',
}
