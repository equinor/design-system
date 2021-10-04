import { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'
import { tableOfContents as tokens } from './TableOfContents.tokens'
import {
  typographyTemplate,
  spacingsTemplate,
  outlineTemplate,
  bordersTemplate,
} from '../../utils'

const StyledLinkItem = styled.li`
  list-style: none;
  margin: 0;
  padding: 0;

  a {
    text-decoration: none;
    ${typographyTemplate(tokens.entities.links.typography)}
    ${spacingsTemplate(tokens.entities.links.spacings)}
    height: ${tokens.entities.links.typography.lineHeight};
    width: ${tokens.entities.links.width};
    display: block;
    position: relative;

    svg {
      fill: ${tokens.entities.icon.background};
      margin-right: ${tokens.entities.icon.spacings.right};
      vertical-align: text-bottom;
    }

    span {
      max-width: ${tokens.entities.span.maxWidth};
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      vertical-align: text-bottom;
      display: inline-block;
    }

    &:focus {
      ${outlineTemplate(tokens.states.focus.outline)};
    }

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        ${typographyTemplate(tokens.states.hover.typography)}
        background: ${tokens.states.hover.background};

        ${bordersTemplate(tokens.states.hover.border)}
        svg {
          fill: ${tokens.states.hover.entities.icon.background};
        }
      }
    }

    &:active {
      outline: none;
    }
  }
`
export type TableOfContentsLinkItemProps = HTMLAttributes<HTMLLIElement>

export const LinkItem = forwardRef<HTMLLIElement, TableOfContentsLinkItemProps>(
  function LinkItem({ children, ...props }, ref) {
    return (
      <StyledLinkItem {...props} ref={ref}>
        {children}
      </StyledLinkItem>
    )
  },
)
