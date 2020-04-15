import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

const StyledBox = styled.div.attrs(() => ({
  tabIndex: 0,
}))`
  width: 15rem;
  height: 15rem;
  background-color: slategrey;
  .js-focus-visible:not([data-js-focus-visible]) &:focus {
    outline: none;
  }
`

const Box = (props) => {
  return <StyledBox>fd</StyledBox>
}

Box.propTypes = {}

export { Box }
