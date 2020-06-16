import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  row-gap: 1rem;
  column-gap: 2rem;
  max-width: 39rem;
`

const Grid = ({ children }) => {
  return <StyledGrid>{children}</StyledGrid>
}

Grid.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Grid //eslint-disable-line
