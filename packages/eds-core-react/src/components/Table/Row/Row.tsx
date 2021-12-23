import { forwardRef } from 'react'
import styled from 'styled-components'
import { token } from './Row.tokens'

type StyledProps = Pick<RowProps, 'active'>

const StyledRow = styled.tr<StyledProps>(({ active }) => ({
  background: active ? token.states.active?.background : null,
  '@media (hover: hover) and (pointer: fine)': {
    ':hover': {
      background: token.states.hover?.background,
    },
  },
}))

export type RowProps = {
  /** Hightlight row as active */
  active?: boolean
} & React.HTMLAttributes<HTMLTableRowElement>

export const Row = forwardRef<HTMLTableRowElement, RowProps>(function Row(
  { ...props },
  ref,
) {
  const { children } = props

  return (
    <StyledRow {...props} ref={ref}>
      {children}
    </StyledRow>
  )
})
