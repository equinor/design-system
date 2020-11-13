import * as React from 'react'
import { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'
import { tableOfContents as tokens } from './TableOfContents.tokens'

const { icon, focus, hover, links, spacings } = tokens

const StyledLinkItem = styled.li`
  list-style: none;
  margin: 0;
  padding: 0;

  a {
    text-decoration: none;
    font-size: ${links.fontSize};
    line-height: ${links.fontLineHeight};
    padding: 10px 18px;
    height: ${links.fontLineHeight};
    width: calc(189px - 36px);
    display: block;
    position: relative;

    &:focus {
      outline: 1px dashed ${focus.border.color};
      outline-offset: 2px;
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

    &:active {
      outline: none;
    }

    svg {
      fill: ${icon.fill};
      margin-right: ${spacings.comfortable.smallSpacings};
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
type LinkItemProps = HTMLAttributes<HTMLLIElement>

export const LinkItem = forwardRef<HTMLLIElement, LinkItemProps>(
  function LinkItem({ children, ...props }, ref) {
    return (
      <StyledLinkItem {...props} ref={ref}>
        {children}
      </StyledLinkItem>
    )
  },
)

// LinkItem.displayName = 'eds-linkitem'
