import { forwardRef } from 'react'
import styled from 'styled-components'
import { token } from './Row.tokens'

type StyledProps = { $active: boolean }

const StyledRow = styled.tr<StyledProps>`
  background: ${({ $active }) =>
    $active ? token.states.active?.background : null};
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: ${token.states.hover?.background};
    }
  }
`

export type RowProps = {
  /** Hightlight row as active */
  active?: boolean
} & React.HTMLAttributes<HTMLTableRowElement>

export const Row = forwardRef<HTMLTableRowElement, RowProps>(function Row(
  { children, active, ...props },
  ref,
) {
  return (
    <StyledRow {...props} $active={active} ref={ref}>
      {children}
    </StyledRow>
  )
})
