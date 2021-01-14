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

export type HeadProps = HTMLAttributes<HTMLTableSectionElement>

export const Head = forwardRef<HTMLTableSectionElement, HeadProps>(
  function Head({ children, ...props }, ref) {
    return (
      <InnerContext.Provider value={{ variant: 'head' }}>
        <StyledTableHead {...props} ref={ref}>
          {children}
        </StyledTableHead>
      </InnerContext.Provider>
    )
  },
)
