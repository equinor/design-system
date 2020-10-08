import React, { forwardRef, HTMLAttributes, ElementType } from 'react'
import styled, { css } from 'styled-components'
import { list as tokens } from './List.tokens'

const { color, typography } = tokens

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
    line-height: ${typography.lineHeight};
    font-size: ${typography.fontSize};
    color: ${color};
  `,
)

type Props = {
  /** Is the list an ordered or unordered list */
  variant?: 'bullet' | 'numbered'
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

List.displayName = 'eds-list'

export { List }
