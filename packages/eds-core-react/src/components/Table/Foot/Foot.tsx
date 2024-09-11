import { HTMLAttributes, forwardRef } from 'react'
import styled from 'styled-components'
import { token } from './Foot.tokens'
import { bordersTemplate } from '@equinor/eds-utils'
import { InnerContext } from '../Inner.context'

const StyledTableFoot = styled.tfoot`
  ${bordersTemplate(token.border)}
  background: ${token.background};
`

export type FootProps = {
  /** Footer will stick to bottom when scrolling */
  sticky?: boolean
} & HTMLAttributes<HTMLTableSectionElement>

export const Foot = forwardRef<HTMLTableSectionElement, FootProps>(
  function Foot({ children, sticky, ...props }, ref) {
    return (
      <InnerContext.Provider value={{ variant: 'foot', sticky }}>
        <StyledTableFoot {...props} ref={ref}>
          {children}
        </StyledTableFoot>
      </InnerContext.Provider>
    )
  },
)
