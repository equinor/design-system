import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { chips as tokens } from './Chips.tokens'

const StyledChips = styled.div`
  background: 'lime';
`

export const Chips = forwardRef(function Chips(props, ref) {
  return <StyledChips />
})

Chips.displayName = 'eds-chips'

Chips.propTypes = {}

Chips.defaultPrpos = {}
