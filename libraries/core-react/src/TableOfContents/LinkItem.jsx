import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { table_of_contents as tokens } from './TableOfContents.tokens'

const StyledLinkItem = styled.li`
  padding: 10px 16px;
`
const LinkItem = forwardRef(function EdsLinkItem({ children, ...props }, ref) {
  return (
    <StyledLinkItem {...props} ref={ref}>
      {children}
    </StyledLinkItem>
  )
})

LinkItem.displayName = 'eds-linkitem'

LinkItem.propTypes = {
  /** @ignore */
  children: PropTypes.node.isRequired,
  /** @ignore */
  className: PropTypes.string,
}

LinkItem.defaultProps = {
  className: undefined,
}

export { LinkItem }
