import * as React from 'react'
import { ReactNode } from 'react'
import styled from 'styled-components'
import { token } from './Cell/HeaderCell.tokens'
import { bordersTemplate } from '@utils'
import { InnerContext } from './Inner.context'

const StyledTableHead = styled.thead`
  ${bordersTemplate(token.border)}
  background: ${token.background};
`

type HeadProps = { children: ReactNode }

export const Head = ({ children, ...props }: HeadProps): JSX.Element => {
  return (
    <InnerContext.Provider value={{ variant: 'head' }}>
      <StyledTableHead {...props}>{children}</StyledTableHead>
    </InnerContext.Provider>
  )
}
