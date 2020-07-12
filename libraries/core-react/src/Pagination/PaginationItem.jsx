import React, { forwardRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Button } from '../Button'
import { Typography } from '../Typography'
import { pagination as tokens } from './Pagination.tokens'
//import { paginationControl } from './paginationControl'

const StyledButton = styled(Button)`
  /* display: inline-grid; */
  background: ${(selected) => (selected ? tokens.selectedColor : null)};
`

export const PaginationItem = forwardRef(function PaginationItem(
  { page, selected, onClick, ...other },
  ref,
) {
  const props = {
    ref,
    page,
    selected,
    ...other,
  }

  return (
    <StyledButton variant="ghost_icon" onClick={onClick} {...props}>
      {page}
    </StyledButton>
  )
})

PaginationItem.displayName = 'eds-pagination-item'

PaginationItem.propTypes = {
  // Current page number
  page: PropTypes.number.isRequired,
  // If current page is selected
  selected: PropTypes.bool.isRequired,
  // Click function
  onClick: PropTypes.func,
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

PaginationItem.defaultProps = {
  className: '',
  onClick: () => {},
  children: undefined,
}
