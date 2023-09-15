import { forwardRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import {
  typographyTemplate,
  spacingsTemplate,
  outlineTemplate,
  bordersTemplate,
} from '@equinor/eds-utils'

const StyledLinkItem = styled.li(({ theme }) => {
  return css`
    list-style: none;
    margin: 0;
    padding: 0;

    a {
      text-decoration: none;
      ${typographyTemplate(theme.entities.links.typography)}
      ${spacingsTemplate(theme.entities.links.spacings)}
  height: ${theme.entities.links.typography.lineHeight};
      width: ${theme.entities.links.width};
      display: block;
      position: relative;

      svg {
        fill: ${theme.entities.icon.background};
        margin-right: ${theme.entities.icon.spacings.right};
        vertical-align: text-bottom;
      }

      span {
        max-width: ${theme.entities.span.maxWidth};
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: text-bottom;
        display: inline-block;
      }

      &:focus {
        ${outlineTemplate(theme.states.focus.outline)};
      }

      @media (hover: hover) and (pointer: fine) {
        &:hover {
          ${typographyTemplate(theme.states.hover.typography)}
          background: ${theme.states.hover.background};

          ${bordersTemplate(theme.states.hover.border)}
          svg {
            fill: ${theme.states.hover.entities.icon.background};
          }
        }
      }

      &:active {
        outline: none;
      }
    }
  `
})

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
