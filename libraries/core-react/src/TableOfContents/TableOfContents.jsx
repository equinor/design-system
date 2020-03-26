import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { List, Typography } from '@equinor/eds-core-react'
// import { tableOfContents as tokens } from './TableOfContents.tokens'

const StyledTableOfContents = styled.nav`
  margin: 48px 0 32px 0;

  ${({ sticky }) =>
    sticky &&
    css`
      position: fixed;
      top: 32px;
      right: 32px;
    `}
`

const TocList = styled((props) => <List {...props} />)`
  margin: 0;
  padding: 0;
`

const TableOfContents = forwardRef(function TableOfContents(
  { children, sticky, label, className, ...rest },
  ref,
) {
  return (
    <StyledTableOfContents
      className={className}
      ref={ref}
      label={label}
      sticky={sticky}
      {...rest}
    >
      <Typography variant="overline">{label}</Typography>
      <TocList>{children}</TocList>
    </StyledTableOfContents>
  )
})

TableOfContents.displayName = 'eds-toc'

TableOfContents.propTypes = {
  /** @ignore */
  children: PropTypes.node.isRequired,
  /** @ignore */
  className: PropTypes.string,
  /** Sticky functions */
  sticky: PropTypes.bool,
  label: PropTypes.string,
}

TableOfContents.defaultProps = {
  className: '',
  sticky: false,
  label: '',
}

export { TableOfContents }
