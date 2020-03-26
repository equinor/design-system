import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { tableOfContents as tokens } from './TableOfContents.tokens'

const { icon, focus, hover } = tokens

const StyledLinkItem = styled.li`
  list-style: none;
  border-radius: ${focus.border.radius};

  a {
    text-decoration: none;
    font-size: 14px;
    line-height: 16px;
    padding: 12px 18px;
    width: calc(189px - 36px);
    display: block;

    &:focus {
      outline: ${focus.border.width} ${focus.border.type} ${focus.border.color};
    }

    &:hover {
      background: ${hover.typography.color};
      color: ${hover.typography.color};
      svg {
        fill: ${hover.typography.color};
      }
    }
    svg {
      fill: ${icon.fill};
      margin-right: 8px;
      vertical-align: text-bottom;
    }
  }
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
