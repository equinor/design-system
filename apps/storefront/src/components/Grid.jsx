import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  row-gap: 1rem;
  column-gap: 1rem;
  padding: 2rem;
  @media (min-width: 1600px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
  ${({ centerContent }) =>
    centerContent &&
    `
    & > div {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 1rem;
    }
  `}
`

const Grid = ({ centerContent, children }) => {
  return <StyledGrid centerContent={centerContent}>{children}</StyledGrid>
}

Grid.propTypes = {
  children: PropTypes.node.isRequired,
  centerContent: PropTypes.bool,
}

Grid.defaultProps = {
  centerContent: PropTypes.false,
}

export default Grid //eslint-disable-line
