import * as React from 'react'
import { FunctionComponent } from 'react'
import styled from 'styled-components'
import { token } from './Cell/HeaderCell.tokens'
import { bordersTemplate } from '@utils'

const StyledTableHead = styled.thead`
  ${bordersTemplate(token.border)}
  background: ${token.background};
`

export const Head: FunctionComponent = ({ children, ...props }) => {
  return <StyledTableHead {...props}>{children}</StyledTableHead>
}

// Head.displayName = 'eds-table-head'
