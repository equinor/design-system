import * as React from 'react'
import { FunctionComponent } from 'react'
import styled from 'styled-components'
import { token } from './Cell/HeaderCell.tokens'
import { bordersTemplate } from '@utils'
import { InnerContext } from './Inner.context'

const StyledTableHead = styled.thead`
  ${bordersTemplate(token.border)}
  background: ${token.background};
`

export const Head: FunctionComponent = ({ children, ...props }) => {
  return (
    <InnerContext.Provider value={{ variant: 'head' }}>
      <StyledTableHead {...props}>{children}</StyledTableHead>
    </InnerContext.Provider>
  )
}

// Head.displayName = 'eds-table-head'
