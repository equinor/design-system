import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { List, Typography } from '..'
import { tableOfContents as tokens } from './TableOfContents.tokens'

const { labelText } = tokens

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

const TocLabel = styled((props) => <Typography {...props} />)`
  color: ${labelText.color};
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
      <TocLabel variant="overline">{label}</TocLabel>
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
  /** Sticky function */
  sticky: PropTypes.bool,
  /** Label or title for the ToC */
  label: PropTypes.string,
}

TableOfContents.defaultProps = {
  className: '',
  sticky: false,
  label: '',
}

export { TableOfContents }
