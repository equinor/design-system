import * as React from 'react'
import { HTMLAttributes, forwardRef } from 'react'
import styled from 'styled-components'
import { token } from './Cell/HeaderCell.tokens'
import { bordersTemplate } from '@utils'
import { InnerContext } from './Inner.context'

const StyledTableHead = styled.thead`
  ${bordersTemplate(token.border)}
  background: ${token.background};
`

export type HeadProps = {
  /** Header will stick to top when scrolling */
  sticky?: boolean
} & HTMLAttributes<HTMLTableSectionElement>

export const Head = forwardRef<HTMLTableSectionElement, HeadProps>(
  function Head({ children, sticky, ...props }, ref) {
    return (
      <InnerContext.Provider value={{ variant: 'head', sticky }}>
        <StyledTableHead {...props} ref={ref}>
          {children}
        </StyledTableHead>
      </InnerContext.Provider>
    )
  },
)
