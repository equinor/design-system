import React, { forwardRef, HTMLAttributes, ElementType } from 'react'
import styled, { css } from 'styled-components'
import { list as tokens } from './List.tokens'
import { typographyTemplate } from '../_common/templates'

const { typography } = tokens

type StyledListProps = {
  as: ElementType
}

const StyledList = styled.div<StyledListProps>(
  ({ as }) =>
    as === 'ol' &&
    css`
      & ol {
        list-style-type: lower-alpha;
      }
    `,
  `
    ${typographyTemplate(typography)}
    `,
)

type Props = {
  /** Is the list an ordered or unordered list */
  variant?: 'bullet' | 'numbered'
  /** Start number if other than 1 for ordered lists */
  start?: string
} & HTMLAttributes<HTMLUListElement | HTMLOListElement>

const List = forwardRef<HTMLUListElement | HTMLOListElement, Props>(
  function List({ children, variant = 'bullet', ...props }, ref) {
    const as: ElementType = variant === 'numbered' ? 'ol' : 'ul'

    return (
      <StyledList as={as} ref={ref} {...props}>
        {children}
      </StyledList>
    )
  },
)

List.displayName = 'List'

export { List, Props }
