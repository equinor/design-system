import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { accordion as tokens } from './Accordion.tokens'

const StyledAccordion = styled.div`
  background: lime;
  height: 50px;
`

const Accordion = forwardRef(function Accordion(props, ref) {
  return <StyledAccordion />
})

Accordion.displayName = 'eds-accordion'

Accordion.propTypes = {}

Accordion.defaultPrpos = {}

export { Accordion }
