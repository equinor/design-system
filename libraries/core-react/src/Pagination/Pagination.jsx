import React, { forwardRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Button } from '../Button'
import { Typography } from '../Typography'
import { pagination as tokens } from './Pagination.tokens'

const Navigation = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const StyledButton = styled(Button)`
  background: ${(active) => (active ? tokens.activeColor : null)};
`

const UnorderedList = styled.ul`
  list-style: none;
`

const ListItem = styled.li``

export const Pagination = forwardRef(function Pagination(
  { pages, total, switcher, ...other },
  ref,
) {
  const props = {
    ref,
    ...other,
  }

  const [pageState, setPageState] = useState(0)

  //const items = [...['first'], ...['previous'], ...startPages]

  return (
    <Navigation role="navigation" aria-label="pagination navigation" {...props}>
      {switcher && (
        <select>
          <option>option 1</option>
          <option>option 2</option>
        </select>
      )}
      <UnorderedList>
        <ListItem>
          <StyledButton variant="ghost_icon">1</StyledButton>
        </ListItem>
      </UnorderedList>
    </Navigation>
  )
})

Pagination.displayName = 'eds-pagination'

Pagination.propTypes = {
  // Number of pages
  pages: PropTypes.number.isRequired,
  // Shows total item count
  total: PropTypes.bool,
  // Dropdown menu to select amount of items per page
  switcher: PropTypes.bool,
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

Pagination.defaultProps = {
  className: '',
  children: undefined,
  total: false,
  switcher: false,
}
