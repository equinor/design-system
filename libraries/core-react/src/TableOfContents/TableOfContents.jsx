import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { tableOfContents as tokens } from './TableOfContents.tokens'

const StyledTableOfContents = styled.nav(
  `
  position: fixed;

  `,
)

const TableOfContents = forwardRef(function TableOfContents(
  { children, sticky, className, ...rest },
  ref,
) {
  return (
    <StyledTableOfContents
      className={className}
      ref={ref}
      sticky={sticky}
      {...rest}
    >
      {children}
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
}

TableOfContents.defaultProps = {
  className: '',
  sticky: false,
}

export { TableOfContents }
