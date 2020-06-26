import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Button } from '../Button'
import { Typography } from '../Typography'
import { pagination as tokens } from './Pagination.tokens'

const StyledButton = styled(Button)`
  background: ${(active) => (active ? tokens.activeColor : null)};
`

export const Pagination = forwardRef(function Pagination(
  { children, ...other },
  ref,
) {
  const props = {
    ref,
    ...other,
  }
  return (
    <nav role="navigation" aria-label="pagination navigation" {...props}>
      <ul>
        <li></li>
      </ul>
    </nav>
  )
})

Pagination.displayName = 'eds-pagination'

Pagination.propTypes = {
  // Pagination children
  children: PropTypes.node.isRequired,
  /** @ignore */
  className: PropTypes.string,
}

Pagination.defaultProps = {
  className: '',
}
