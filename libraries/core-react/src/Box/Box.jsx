import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

const StyledBox = styled.div.attrs(() => ({
  tabIndex: 0,
}))`
  width: 15rem;
  height: 15rem;
  background-color: slategrey;
  &:focus {
    outline: none;
  }
  &[data-focus-visible-added]:focus {
    outline: 10px dotted orange;
  }
`

const Box = (props) => {
  return <StyledBox>fd</StyledBox>
}

Box.propTypes = {}

export { Box }
