import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { tableOfContents as tokens } from './TableOfContents.tokens'

const { icon, focus, hover, colors } = tokens

const StyledLinkItem = styled.li`
  list-style: none;

  a {
    text-decoration: none;
    font-size: 14px;
    line-height: 16px;
    padding: 12px 18px;
    width: calc(189px - 36px);
    display: block;

    &:focus {
      outline: ${focus.border.width} ${focus.border.type} ${focus.border.color};
      border-radius: ${focus.border.borderRadius};
    }

    &:hover {
      background: ${hover.background};
      color: ${hover.typography.color};
      border-radius: ${hover.borderRadius};

      svg {
        fill: ${hover.typography.color};
      }
    }
    svg {
      fill: ${icon.fill};
      margin-right: 8px;
      vertical-align: text-bottom;
    }

    span {
      max-width: 115px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      vertical-align: text-bottom;
      display: inline-block;
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
